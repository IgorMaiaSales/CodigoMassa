import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Problem } from '@/types/problem';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const level = searchParams.get('level');
    const phase = searchParams.get('phase');

    console.log('\n--- 🕵️ INICIANDO DIAGNÓSTICO ---');
    console.log(`Recebido da URL -> Phase: "${phase}" | Tipo: ${typeof phase}`);

    let problemsRef = db.collection('problems');
    let query: FirebaseFirestore.Query = problemsRef;

    // --- TESTE DE FASE (Se houver filtro) ---
    if (phase && phase !== 'Todos') {
      const phaseInt = parseInt(phase);
      
      // Teste 1: Buscando como NÚMERO
      const checkNumber = await problemsRef.where('phase', '==', phaseInt).get();
      console.log(`🔎 Teste buscando 'phase' == ${phaseInt} (Number): Encontrou ${checkNumber.size} docs`);

      // Teste 2: Buscando como STRING
      const checkString = await problemsRef.where('phase', '==', phase).get();
      console.log(`🔎 Teste buscando 'phase' == "${phase}" (String): Encontrou ${checkString.size} docs`);

      // Teste 3: Verificando se o nome do campo é 'fase' em vez de 'phase'
      const checkFase = await problemsRef.where('fase', '==', phaseInt).get();
      console.log(`🔎 Teste buscando campo 'fase' (português): Encontrou ${checkFase.size} docs`);

      // APLICA O FILTRO QUE FUNCIONOU (Prioridade para Number no campo 'phase')
      if (!isNaN(phaseInt)) {
        query = query.where('phase', '==', phaseInt);
      }
    }

    // Filtros de Ano e Nível (Mantidos)
    if (year && year !== 'Todos') query = query.where('year', '==', parseInt(year));
    if (level && level !== 'Todos') query = query.where('level', '==', level);

    const snapshot = await query.get();
    
    // Debug final dos dados retornados
    if (!snapshot.empty) {
      const primeiroDoc = snapshot.docs[0].data();
      console.log('✅ Sucesso! Exemplo de documento encontrado:', {
        id: snapshot.docs[0].id,
        phase_banco: primeiroDoc.phase,
        fase_banco: primeiroDoc.fase, // Para checar se existe
        type_phase: typeof primeiroDoc.phase
      });
    } else {
      console.log('❌ Nenhum documento retornado na consulta final.');
    }

    const problems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Problem[];
    return NextResponse.json(problems);

  } catch (error) {
    console.error("❌ Erro fatal:", error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}