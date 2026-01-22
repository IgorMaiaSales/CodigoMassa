import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { uid, secret } = await request.json();

    // Uma senha simples para impedir que qualquer um use essa rota
    // Você pode definir isso no .env.local ou deixar fixo aqui temporariamente
    const ADMIN_SECRET = process.env.ADMIN_SECRET || "senha-forte";

    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    // Define a claim "admin" no usuário
    await auth.setCustomUserClaims(uid, { admin: true });

    return NextResponse.json({ message: `Sucesso! O usuário ${uid} agora é admin.` });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao definir admin' }, { status: 500 });
  }
}