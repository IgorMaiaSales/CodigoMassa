import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'UID é obrigatório' }, { status: 400 });
    }

    // Busca todas as submissões na sub-coleção do usuário
    // Caminho: users/{uid}/submissions
    const submissionsRef = db.collection('users').doc(uid).collection('submissions');
    const snapshot = await submissionsRef.get();

    // Transforma em um objeto onde a CHAVE é o ID do problema (slug)
    // Isso facilita a busca instantânea no frontend: submissions[problemId]
    const submissionsMap: Record<string, any> = {};
    
    snapshot.forEach(doc => {
      submissionsMap[doc.id] = doc.data();
    });

    return NextResponse.json(submissionsMap);

  } catch (error) {
    console.error("Erro ao buscar submissões:", error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}