import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// Instância Pública do Judge0
const JUDGE0_URL = 'https://ce.judge0.com'; 

// 1. Interface de Erro
interface SubmissionError {
  status: string;
  status_description: string;
  failed_at: number;
  stderr: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, source_code, language_id } = body;

    console.log(`\n📨 Nova Submissão: ${slug} (Lang: ${language_id})`);

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

    let testDocs = testsSnapshot.docs.map(doc => doc.data());
    testDocs.sort((a, b) => (a.order || 0) - (b.order || 0));

    // --- 3. Envia para o Judge0 ---
    const submissions = testDocs.map(data => ({
        source_code: source_code,
        language_id: language_id,
        stdin: data.input || "",
        expected_output: data.output || "",
        cpu_time_limit: 2, 
        memory_limit: 128000 
    }));

    console.log(`🚀 Enviando ${submissions.length} testes para o Juiz...`);

    const judgeResponse = await fetch(`${JUDGE0_URL}/submissions/batch?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissions })
    });

    if (!judgeResponse.ok) {
        return NextResponse.json({ error: 'Erro ao conectar com o Juiz.' }, { status: 502 });
    }

    let results = await judgeResponse.json();

    // Polling
    if (Array.isArray(results) && results.length > 0 && results[0].token && !results[0].status) {
        console.log("⏳ Aguardando processamento...");
        const tokens = results.map((r: any) => r.token).join(',');
        let attempts = 0;
        while (attempts < 10) {
            await new Promise(r => setTimeout(r, 1000));
            attempts++;
            const pollRes = await fetch(`${JUDGE0_URL}/submissions/batch?tokens=${tokens}&base64_encoded=false&fields=status,time,memory,stderr,compile_output`, { method: 'GET' });
            if (!pollRes.ok) continue;
            const pollData = await pollRes.json();
            if (pollData.submissions.every((s: any) => s.status && s.status.id >= 3)) {
                results = pollData.submissions;
                break;
            }
        }
    }

    if (!Array.isArray(results)) results = (results as any).submissions || [];

    // --- 4. Análise de Resultados ---
    console.log("📝 Calculando pontuação...");

    const subtaskStatus = new Map<number, boolean>();
    subtaskScores.forEach((_, id) => subtaskStatus.set(id, true));

    let maxTime = 0;
    let maxMemory = 0;
    
    // Variável tipada
    let firstError: SubmissionError | null = null;

    // Loop 'for' para evitar erro do TypeScript 'never'
    for (let index = 0; index < results.length; index++) {
        const res = results[index];
        const testCase = testDocs[index];
        const subId = testCase.subtask_id || 0;

        if (res.time && parseFloat(res.time) > maxTime) maxTime = parseFloat(res.time);
        if (res.memory && res.memory > maxMemory) maxMemory = res.memory;

        const isAccepted = res.status && res.status.id === 3;

        if (!isAccepted) {
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

    console.log(`📊 Resultado: ${verdict} (${finalScore}/${totalPossibleScore})`);

    // --- RETORNO JSON (CORRIGIDO) ---
    return NextResponse.json({
        // 1. Espalhamos o erro PRIMEIRO (se existir)
        ...(firstError || {}),
        
        // 2. Definimos nossas propriedades DEPOIS, para garantir que 'status' seja o correto
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