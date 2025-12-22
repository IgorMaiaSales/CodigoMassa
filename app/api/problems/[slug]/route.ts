// src/app/api/problems/[slug]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Busca pelo campo 'slug' em vez do ID do documento
    const problemsRef = db.collection('problems');
    const snapshot = await problemsRef.where('slug', '==', slug).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Problema não encontrado' }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    const problemData = { id: doc.id, ...doc.data() };

    return NextResponse.json(problemData);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}