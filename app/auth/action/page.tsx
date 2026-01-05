'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthActionHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // O Firebase envia o parâmetro 'mode' e 'oobCode' na URL
    const mode = searchParams.get('mode'); 
    const oobCode = searchParams.get('oobCode');
    const apiKey = searchParams.get('apiKey');

    if (!mode || !oobCode) {
      router.push('/login'); // Link inválido, manda pro login
      return;
    }

    // Monta a query string para preservar o código
    const query = `?oobCode=${oobCode}&apiKey=${apiKey}`;

    // O "Guarda de Trânsito" decide para onde ir
    switch (mode) {
      case 'resetPassword':
        router.replace(`/reset-password${query}`);
        break;
      case 'verifyEmail':
        router.replace(`/verify-email${query}`); // Ou sua página de verificação
        break;
      default:
        router.push('/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1A18] text-[#EAEAEA]">
      <p>Redirecionando...</p>
    </div>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthActionHandler />
    </Suspense>
  );
}