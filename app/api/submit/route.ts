import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// Instância Pública do Judge0
const JUDGE0_URL = 'https://ce.judge0.com'; 

// Lote de 10 é bom, mas requer paciência no polling
const BATCH_SIZE = 10; 

interface SubmissionError {
  status: string;
  status_description: string;
  failed_at: number;
  stderr: string;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, source_code, language_id, uid } = body;

    console.log(`\n📨 Nova Submissão: ${slug} (Lang: ${language_id}) User: ${uid}`);

    // --- 1. Busca Dados do Problema ---
    const problemDocRef = db.collection('problems').doc(slug);
    const problemDoc = await problemDocRef.get();

    if (!problemDoc.exists) {
        return NextResponse.json({ error: 'Problema não encontrado.' }, { status: 404 });
    }

    const problemData = problemDoc.data();
    
    // Mapeia Subtask ID para Score
    const subtaskScores = new Map<number, number>();
    let totalPossibleScore = 0;

    if (problemData?.subtasks && Array.isArray(problemData.subtasks)) {
        problemData.subtasks.forEach((sub: any) => {
            subtaskScores.set(sub.id, sub.score);
            totalPossibleScore += sub.score;
        });
    }

    if (subtaskScores.size === 0) {
        subtaskScores.set(0, 100);
        totalPossibleScore = 100;
    }

    // --- 2. Prepara Submissões ---
    const testsSnapshot = await problemDocRef.collection('test_cases').get();
    let testDocs: any[] = [];
    
    if (!testsSnapshot.empty) {
        testDocs = testsSnapshot.docs.map(doc => doc.data());
    } else if (problemData?.testCases) {
        testDocs = problemData.testCases;
    } else {
        return NextResponse.json({ error: 'Sem casos de teste.' }, { status: 500 });
    }

    // Ordena
    testDocs.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Prepara payload
    const allSubmissionsPayload = testDocs.map(data => ({
        source_code: source_code,
        language_id: language_id,
        stdin: data.input || data.inputs || data.stdin || "",
        expected_output: data.output || data.outputs || data.expected_output || "",
        cpu_time_limit: 5, // Aumentei para garantir
        memory_limit: 128000 
    }));

    // Divide em lotes
    const chunks = [];
    for (let i = 0; i < allSubmissionsPayload.length; i += BATCH_SIZE) {
        chunks.push(allSubmissionsPayload.slice(i, i + BATCH_SIZE));
    }

    console.log(`🚀 Disparando ${chunks.length} lotes em PARALELO (${allSubmissionsPayload.length} testes)...`);

    // --- 3. Envio e Polling Inteligente ---
    const promises = chunks.map(async (chunk, idx) => {
        try {
            // Envia o lote
            const res = await fetch(`${JUDGE0_URL}/submissions/batch?base64_encoded=false&wait=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissions: chunk })
            });

            if (!res.ok) throw new Error(`Status ${res.status}`);

            let data = await res.json();
            // Normaliza resposta (Judge0 pode retornar array direto ou objeto)
            let submissions = Array.isArray(data) ? data : (data.submissions || []);

            // --- CORREÇÃO CRÍTICA AQUI ---
            // Verifica se ALGUÉM ainda está processando (Status <= 2 ou null)
            const needsPolling = submissions.some((s: any) => !s.status || s.status.id <= 2);

            if (needsPolling) {
                console.log(`⏳ Lote ${idx + 1}: Polling necessário...`);
                const tokens = submissions.map((r: any) => r.token).join(',');
                
                // Tenta por até 20 segundos (10 x 2s)
                for (let attempt = 1; attempt <= 10; attempt++) {
                    await sleep(2000); 
                    
                    const pollRes = await fetch(`${JUDGE0_URL}/submissions/batch?tokens=${tokens}&base64_encoded=false&fields=status,time,memory,stderr,compile_output,message`, { method: 'GET' });
                    
                    if (!pollRes.ok) continue;

                    const pollData = await pollRes.json();
                    
                    // Atualiza a variável com os dados MAIS RECENTES
                    if (pollData.submissions) {
                        submissions = pollData.submissions;
                    }

                    // Se todos terminaram (Status >= 3), podemos sair
                    if (submissions.every((s: any) => s.status && s.status.id >= 3)) {
                        break;
                    }
                }
            }
            
            return submissions;

        } catch (err: any) {
            console.error(`Erro no lote ${idx}:`, err);
            return chunk.map(() => ({
                status: { id: 13, description: "Internal Error" },
                stderr: `Erro na API: ${err.message}`
            }));
        }
    });

    const resultsArrays = await Promise.all(promises);
    const allResults = resultsArrays.flat();

    // --- 4. Processamento ---
    console.log(`📝 Analisando ${allResults.length} resultados...`);

    const subtaskStatus = new Map<number, boolean>();
    subtaskScores.forEach((_, id) => subtaskStatus.set(id, true));

    let maxTime = 0;
    let maxMemory = 0;
    let firstError: SubmissionError | null = null;

    for (let index = 0; index < allResults.length; index++) {
        const res = allResults[index];
        const testCase = testDocs[index];
        if (!testCase) continue;

        const subId = testCase.subtask_id || 0;

        if (res.time && parseFloat(res.time) > maxTime) maxTime = parseFloat(res.time);
        if (res.memory && res.memory > maxMemory) maxMemory = res.memory;

        // Status 3 = Accepted
        const isAccepted = res.status?.id === 3;

        if (!isAccepted) {
            subtaskStatus.set(subId, false);

            if (!firstError) {
                const desc = res.status?.description || "Erro Desconhecido (Timeout)";
                const log = res.stderr || res.compile_output || res.message || "Sem logs disponíveis";
                
                console.log(`❌ Falha no teste ${index + 1}: ${desc}`);
                
                firstError = {
                    status: "Erro",
                    status_description: desc,
                    failed_at: index + 1,
                    stderr: log
                };
            }
        }
    }

    // Calcula Nota
    let finalScore = 0;
    const subtasksDetail: any[] = [];
    const sortedIds = Array.from(subtaskScores.keys()).sort((a, b) => a - b);

    sortedIds.forEach((id) => {
        const passed = subtaskStatus.get(id) || false;
        const score = subtaskScores.get(id) || 0;
        if (passed) finalScore += score;
        subtasksDetail.push({ id, score, passed });
    });

    // Veredito
    let verdict = "Wrong Answer";
    if (finalScore === totalPossibleScore && totalPossibleScore > 0) verdict = "Accepted";
    else if (finalScore > 0) verdict = "Partial";

    // Refinamento do erro
    if (finalScore === 0 && firstError) {
        if (firstError.status_description.includes("Compilation")) verdict = "Compilation Error";
        else if (firstError.status_description.includes("Runtime")) verdict = "Runtime Error";
    }

    console.log(`📊 Resultado Final: ${verdict} (${finalScore} pts)`);

    // --- 5. Persistência ---
    if (uid) {
        try {
            const userRef = db.collection('users').doc(uid);
            const bestRef = userRef.collection('submissions').doc(slug);
            const latestRef = userRef.collection('latest').doc(slug);
            const historyRef = userRef.collection('history').doc();

            const bestDoc = await bestRef.get();
            const previousBestScore = bestDoc.exists ? bestDoc.data()?.score || 0 : 0;

            let scoreDelta = 0;
            let solvedDelta = 0;
            let isNewRecord = false;

            if (finalScore > previousBestScore) {
                isNewRecord = true;
                scoreDelta = finalScore - previousBestScore;
                if (finalScore === 100 && previousBestScore < 100) solvedDelta = 1;
            }

            const batch = db.batch();

            batch.set(userRef, {
                lastActive: Timestamp.now(),
                totalSubmissions: FieldValue.increment(1),
                rankingScore: FieldValue.increment(scoreDelta),
                problemsSolved: FieldValue.increment(solvedDelta)
            }, { merge: true });

            if (isNewRecord || !bestDoc.exists) {
                batch.set(bestRef, {
                    problemId: slug,
                    score: finalScore,
                    totalPossible: totalPossibleScore,
                    status: verdict,
                    language: language_id,
                    submittedAt: Timestamp.now(),
                    code: source_code,
                    time: maxTime,
                    memory: maxMemory
                }, { merge: true });
            }

            batch.set(latestRef, {
                problemId: slug,
                score: finalScore,
                status: verdict,
                language: language_id,
                submittedAt: Timestamp.now(),
                code: source_code
            });

            batch.set(historyRef, {
                problemId: slug,
                score: finalScore,
                totalPossible: totalPossibleScore,
                status: verdict,
                statusDescription: firstError?.status_description || verdict,
                language: language_id,
                submittedAt: Timestamp.now(),
                time: maxTime,
                memory: maxMemory
            });

            await batch.commit();
        } catch (dbErr) {
            console.error("Erro no DB:", dbErr);
        }
    }

    return NextResponse.json({
        ...(firstError || {}),
        status: verdict,
        score: finalScore,
        total_score: totalPossibleScore,
        time: maxTime + "s",
        memory: (maxMemory / 1024).toFixed(1) + "MB",
        subtasks: subtasksDetail, 
    });

  } catch (error) {
    console.error("❌ Erro fatal:", error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}