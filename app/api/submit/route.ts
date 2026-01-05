import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// Instância Pública do Judge0
const JUDGE0_URL = 'https://ce.judge0.com'; 

// CONFIGURAÇÃO DE LOTES
// A API pública é instável. Enviar 5 a 10 por vez é seguro.
const BATCH_SIZE = 10; 

interface SubmissionError {
  status: string;
  status_description: string;
  failed_at: number;
  stderr: string;
}

// Função auxiliar para esperar (delay) entre lotes para não levar block da API
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
    
    // Mapa de Pontuação das Subtarefas
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

    // --- 2. Busca Casos de Teste ---
    const testsSnapshot = await problemDocRef.collection('test_cases').get();
    if (testsSnapshot.empty) {
        return NextResponse.json({ error: 'Sem casos de teste.' }, { status: 500 });
    }

    // Ordena para garantir que o índice 0 seja o teste 1, etc.
    let testDocs = testsSnapshot.docs.map(doc => doc.data());
    testDocs.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Prepara todos os objetos de submissão
    const allSubmissionsPayload = testDocs.map(data => ({
        source_code: source_code,
        language_id: language_id,
        stdin: data.input || "",
        expected_output: data.output || "",
        cpu_time_limit: 2, 
        memory_limit: 128000 
    }));

    // --- DIVISÃO EM CHUNKS (Mantida, mas usada diferente) ---
    const chunks = [];
    for (let i = 0; i < allSubmissionsPayload.length; i += BATCH_SIZE) {
        chunks.push(allSubmissionsPayload.slice(i, i + BATCH_SIZE));
    }

    console.log(`🚀 Disparando ${chunks.length} lotes em PARALELO...`);

    // --- 3. ENVIO PARALELO (A Grande Mudança) ---
    // Criamos um array de Promessas. O fetch acontece INSTANTANEAMENTE para todos.
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
            
            // Lógica de Polling Individual para cada lote (caso o wait=true não resolva)
            // É importante que cada "thread" cuide do seu próprio polling
            if (Array.isArray(data) && data.length > 0 && data[0].token && !data[0].status) {
                const tokens = data.map((r: any) => r.token).join(',');
                let attempts = 0;
                // Polling rápido (máx 5s)
                while (attempts < 5) {
                    await new Promise(r => setTimeout(r, 1000));
                    attempts++;
                    const pollRes = await fetch(`${JUDGE0_URL}/submissions/batch?tokens=${tokens}&base64_encoded=false&fields=status,time,memory,stderr,compile_output`, { method: 'GET' });
                    if (!pollRes.ok) continue;
                    const pollData = await pollRes.json();
                    if (pollData.submissions.every((s: any) => s.status && s.status.id >= 3)) {
                        data = pollData.submissions;
                        break;
                    }
                }
            }
            
            // Retorna os resultados normatizados
            return Array.isArray(data) ? data : (data as any).submissions || [];
        } catch (err) {
            console.error(`Erro no lote ${idx}:`, err);
            // Retorna um array de erros para não quebrar o Promise.all inteiro
            // Isso simula que todos os testes desse lote falharam
            return chunk.map(() => ({
                status: { id: 6, description: "Runtime Error (Judge Error)" },
                stderr: "Erro de comunicação com o juiz."
            }));
        }
    });

    // O Promise.all espera TODAS as requisições terminarem.
    // O tempo total será igual ao tempo do lote mais lento, não a soma de todos.
    const resultsArrays = await Promise.all(promises);

    // "Aplaina" o array de arrays em um único array de resultados
    const allResults = resultsArrays.flat();

    // --- 4. Análise de Resultados (Agora usando allResults) ---
    console.log(`📝 Calculando pontuação baseada em ${allResults.length} resultados...`);

    const subtaskStatus = new Map<number, boolean>();
    subtaskScores.forEach((_, id) => subtaskStatus.set(id, true));

    let maxTime = 0;
    let maxMemory = 0;
    let firstError: SubmissionError | null = null;

    // Importante: Como processamos sequencialmente, a ordem de allResults deve bater com testDocs
    for (let index = 0; index < allResults.length; index++) {
        const res = allResults[index];
        const testCase = testDocs[index]; // Pega o caso de teste original correspondente

        if (!testCase) continue; // Segurança

        const subId = testCase.subtask_id || 0;

        if (res.time && parseFloat(res.time) > maxTime) maxTime = parseFloat(res.time);
        if (res.memory && res.memory > maxMemory) maxMemory = res.memory;

        const isAccepted = res.status && res.status.id === 3;

        if (!isAccepted) {
            // Se UM teste da subtask falhar, a subtask inteira falha
            subtaskStatus.set(subId, false);

            if (!firstError) {
                firstError = {
                    status: "Erro",
                    status_description: res.status?.description || "Erro",
                    failed_at: index + 1,
                    stderr: res.stderr || res.compile_output || res.message || ""
                };
            }
        }
    }

    // Calcula Nota Final
    let finalScore = 0;
    const subtasksDetail: any[] = [];
    const sortedIds = Array.from(subtaskScores.keys()).sort((a, b) => a - b);

    sortedIds.forEach((id) => {
        const passed = subtaskStatus.get(id) || false;
        const score = subtaskScores.get(id) || 0;
        if (passed) finalScore += score;

        subtasksDetail.push({
            id: id,
            score: score,
            passed: passed
        });
    });

    // --- VEREDITO ---
    let verdict = "Wrong Answer";

    if (finalScore === totalPossibleScore && totalPossibleScore > 0) {
        verdict = "Accepted";
    } else if (finalScore > 0) {
        verdict = "Partial";
    }
    
    if (finalScore === 0 && firstError && firstError.status_description.includes("Compilation")) {
        verdict = "Compilation Error";
    }

    console.log(`📊 Resultado Final: ${verdict} (${finalScore}/${totalPossibleScore})`);

    // --- 5. PERSISTÊNCIA NO FIRESTORE (Código Mantido) ---
    if (uid) {
        // ... (Mantive sua lógica de persistência igual)
        try {
            const userSubmissionRef = db.collection('users').doc(uid).collection('submissions').doc(slug);
            const existingDoc = await userSubmissionRef.get();
            const previousData = existingDoc.exists ? existingDoc.data() : null;
            const previousScore = previousData?.score || 0;

            if (!existingDoc.exists || finalScore > previousScore) {
                console.log(`💾 Salvando novo recorde para ${uid}...`);
                await userSubmissionRef.set({
                    problemId: slug,
                    score: finalScore,
                    totalPossible: totalPossibleScore,
                    status: verdict,
                    language: language_id,
                    submittedAt: new Date(),
                    code: source_code
                }, { merge: true });
            }
        } catch (dbError) {
            console.error("Erro ao salvar no BD:", dbError);
        }
    }

    // --- RETORNO ---
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