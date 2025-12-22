import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(
  request: Request,
  // 1. A tipagem muda: params agora é uma Promise
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 2. É obrigatório fazer o await antes de ler a propriedade
    const { slug } = await params;

    // Busca pelo campo 'slug' em vez do ID do documento
    // Nota: Se você estiver usando o slug como o próprio ID do documento no Firestore 
    // (como fizemos no script de importação: .document(slug)), 
    // você pode simplificar e usar db.collection('problems').doc(slug).get()
    // Mas a query abaixo também funciona perfeitamente.
    const problemsRef = db.collection('problems');
    const snapshot = await problemsRef.where('slug', '==', slug).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Problema não encontrado' }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    const problemData = { id: doc.id, ...doc.data() };

    return NextResponse.json(problemData);
  } catch (error) {
    console.error("Erro na API de detalhes:", error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}