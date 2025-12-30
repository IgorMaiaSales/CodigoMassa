import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  const snapshot = await db.collection('problems').get();
  const batch = db.batch();
  let count = 0;

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    // Se for string, converte para array
    if (typeof data.level === 'string') {
      batch.update(doc.ref, { level: [data.level] });
      count++;
    }
  });

  if (count > 0) await batch.commit();
  return NextResponse.json({ message: `Migrados ${count} documentos para Array.` });
}