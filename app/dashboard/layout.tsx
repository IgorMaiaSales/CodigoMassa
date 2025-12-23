// app/dashboard/layout.tsx
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Se não tá logado, vai pro login
      router.push('/login');
      return;
    }

    if (!user.emailVerified) {
      // Se tá logado mas não verificou, joga pra página de verificação
      router.push('/verify-email');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="h-screen w-full bg-[#0F1A18] flex items-center justify-center text-[#3A7D63]">Carregando ambiente...</div>;
  }

  // Se não houver usuário ou não for verificado, não renderiza nada enquanto redireciona
  if (!user || !user.emailVerified) return null;

  return <>{children}</>;
}