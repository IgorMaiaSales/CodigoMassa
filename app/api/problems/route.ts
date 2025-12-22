// src/app/api/problems/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Problem } from '@/types/problem';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const level = searchParams.get('level');
    const phase = searchParams.get('phase');

    let problemsRef = db.collection('problems');
    let query: FirebaseFirestore.Query = problemsRef;

    // Aplicar Filtros se existirem
    if (year && year !== 'Todos') query = query.where('year', '==', parseInt(year));
    if (level && level !== 'Todos') query = query.where('level', '==', level);
    if (phase && phase !== 'Todos') query = query.where('phase', '==', phase);

    // Dica: Para busca por texto (search), o Firestore é limitado. 
    // Idealmente filtramos no front ou usamos Algolia/Elasticsearch.
    // Aqui retornaremos tudo filtrado e deixamos a busca por nome para o front por enquanto.
    
    const snapshot = await query.get();
    
    const problems: Problem[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Problem[];

    // Ordenação simples (Firestore exige índices compostos para ordernar com where, 
    // então fazemos no código por simplicidade inicial)
    problems.sort((a, b) => b.year - a.year);

    return NextResponse.json(problems);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar problemas' }, { status: 500 });
  }
}