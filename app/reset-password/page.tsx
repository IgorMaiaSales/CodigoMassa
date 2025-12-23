'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyPasswordResetCode, confirmPasswordReset, getAuth } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // O Firebase envia o código no parâmetro 'oobCode'
    const oobCode = searchParams.get('oobCode');

    const [newPassword, setNewPassword] = useState('');
    const [email, setEmail] = useState(''); // Opcional: mostrar o email sendo resetado
    const [status, setStatus] = useState<'verifying' | 'valid' | 'invalid' | 'success' | 'error'>('verifying');

    // 1. Validação do Código ao carregar a página
    useEffect(() => {
        if (!oobCode) {
            setStatus('invalid');
            return;
        }

        verifyPasswordResetCode(auth, oobCode)
            .then((email) => {
                setEmail(email);
                setStatus('valid');
            })
            .catch((error) => {
                console.error("Código inválido ou expirado:", error);
                setStatus('invalid');
            });
    }, [oobCode]);

    // 2. Ação de Resetar
    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oobCode) return;

        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            setStatus('success');
            setTimeout(() => router.push('/login'), 3000);
        } catch (error) {
            console.error("Erro ao resetar:", error);
            setStatus('error');
        }
    };

    // Renderização dos Estados
    if (status === 'verifying') {
        return <p className="text-[#8CA69E]">Verificando link de segurança...</p>;
    }

    if (status === 'invalid') {
        return (
            <div className="text-center space-y-4">
                <div className="text-[#CF5C5C] text-5xl mb-2">⚠️</div>
                <h2 className="text-xl font-bold text-[#EAEAEA]">Link Inválido ou Expirado</h2>
                <p className="text-[#8CA69E]">Este link de recuperação não é mais válido.</p>
                <Link href="/forgot-password" className="block w-full py-3 bg-[#2A453F] hover:bg-[#3A7D63] text-white rounded-lg transition-colors">
                    Solicitar novo link
                </Link>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="text-center space-y-4">
                <div className="text-[#3A7D63] text-5xl mb-2">✅</div>
                <h2 className="text-xl font-bold text-[#EAEAEA]">Senha Alterada!</h2>
                <p className="text-[#8CA69E]">Sua senha foi atualizada com sucesso. Redirecionando...</p>
                <Link href="/login" className="block text-[#3A7D63] hover:underline">
                    Ir para Login agora
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleReset} className="space-y-6 w-full max-w-sm">
             <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#EAEAEA]">Nova Senha</h2>
                <p className="text-[#8CA69E] text-sm">Defina uma nova senha para {email}</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-[#EAEAEA]">Nova Senha</label>
                <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full px-4 py-3 bg-[#0F1A18] border border-[#2A453F] rounded-lg focus:ring-2 focus:ring-[#3A7D63] text-[#EAEAEA] outline-none" 
                    placeholder="••••••••"
                />
            </div>

            <button 
                type="submit" 
                className="w-full py-3 bg-[#3A7D63] hover:bg-[#6BBF99] text-white font-bold rounded-lg transition-all"
            >
                Salvar Nova Senha
            </button>
        </form>
    );
}

// O componente principal precisa envolver o hook useSearchParams em Suspense
export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1A18] p-4 font-sans">
            <div className="mb-8">
                <Logo />
            </div>
            <div className="w-full max-w-md bg-[#13201E] p-8 rounded-xl border border-[#2A453F] shadow-2xl flex flex-col items-center">
                <Suspense fallback={<div className="text-[#8CA69E]">Carregando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}