'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo'; // Assumindo que você tem esse componente

export default function VerifyEmailPage() {
  const [user, loading] = useAuthState(auth);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  // Se não tiver usuário logado, manda pro login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Função para checar se o usuário já verificou (pode ser chamado por um botão)
  const checkVerification = async () => {
    if (user) {
      await user.reload(); // Atualiza os dados do usuário do Firebase
      if (user.emailVerified) {
        router.push('/problems');
      } else {
        alert('E-mail ainda não verificado. Verifique sua caixa de entrada.');
      }
    }
  };

  const resendEmail = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000); // Reseta mensagem após 5s
      } catch (error) {
        console.error("Erro ao reenviar:", error);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen bg-[#0F1A18] flex items-center justify-center text-[#8CA69E]">Carregando...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1A18] p-4 text-[#EAEAEA]">
      <div className="w-full max-w-md space-y-8 bg-[#13201E] p-8 rounded-xl border border-[#2A453F] shadow-2xl">
        
        <div className="text-center">
            {/* Ícone de Email */}
            <div className="mx-auto h-16 w-16 bg-[#3A7D63]/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3A7D63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Verifique seu e-mail</h2>
            <p className="text-[#8CA69E]">
              Enviamos um link de confirmação para <br/>
              <span className="text-[#EAEAEA] font-mono">{user?.email}</span>
            </p>
        </div>

        <div className="space-y-4">
            <button
                onClick={checkVerification}
                className="w-full py-3 px-4 bg-[#3A7D63] hover:bg-[#6BBF99] text-white font-bold rounded-lg transition-all transform hover:-translate-y-0.5"
            >
                Já verifiquei meu e-mail
            </button>

            <button
                onClick={resendEmail}
                disabled={emailSent}
                className="w-full py-3 px-4 bg-transparent border border-[#2A453F] text-[#8CA69E] hover:text-[#EAEAEA] hover:border-[#8CA69E] rounded-lg transition-colors"
            >
                {emailSent ? 'E-mail reenviado!' : 'Reenviar e-mail'}
            </button>
        </div>

        <div className="text-center pt-4 border-t border-[#2A453F]">
            <button onClick={handleLogout} className="text-sm text-[#CF5C5C] hover:underline">
                Sair / Entrar com outra conta
            </button>
        </div>
      </div>
    </div>
  );
}