'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Logo } from '@/components/Logo'; // Certifique-se que o caminho está correto
import Link from 'next/link';

function VerifyEmailForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // O Firebase envia o código no parâmetro 'oobCode' e o modo no 'mode'
    const oobCode = searchParams.get('oobCode');
    const mode = searchParams.get('mode');

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Se não houver código, ou se o modo não for verificar email (segurança extra)
        if (!oobCode) {
            setStatus('error');
            setErrorMessage('Link inválido ou mal formatado.');
            return;
        }

        // Executa a verificação
        applyActionCode(auth, oobCode)
            .then(() => {
                setStatus('success');
                // Opcional: Redirecionar automaticamente após alguns segundos
                setTimeout(() => router.push('/login'), 4000);
            })
            .catch((error) => {
                console.error("Erro na verificação:", error);
                let msg = "Ocorreu um erro ao verificar seu email.";
                
                // Tratamento de erros comuns do Firebase
                if (error.code === 'auth/expired-action-code') {
                    msg = "Este link expirou. Por favor, solicite um novo.";
                } else if (error.code === 'auth/invalid-action-code') {
                    msg = "Este link já foi usado ou é inválido.";
                } else if (error.code === 'auth/user-disabled') {
                    msg = "O usuário correspondente foi desativado.";
                }
                
                setStatus('error');
                setErrorMessage(msg);
            });
    }, [oobCode, mode, router]);

    // --- Renderização dos Estados ---

    if (status === 'verifying') {
        return (
            <div className="text-center space-y-4">
                <div className="animate-pulse text-[#3A7D63] text-5xl mb-2">⏳</div>
                <h2 className="text-xl font-bold text-[#EAEAEA]">Verificando...</h2>
                <p className="text-[#8CA69E]">Estamos validando seu email no sistema.</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center space-y-4">
                <div className="text-[#CF5C5C] text-5xl mb-2">⚠️</div>
                <h2 className="text-xl font-bold text-[#EAEAEA]">Falha na Verificação</h2>
                <p className="text-[#8CA69E]">{errorMessage}</p>
                {/* Aqui você pode adicionar um botão para reenviar o email se tiver essa lógica implementada */}
                <Link href="/login" className="block w-full py-3 bg-[#2A453F] hover:bg-[#3A7D63] text-white rounded-lg transition-colors">
                    Voltar para Login
                </Link>
            </div>
        );
    }

    // Status === 'success'
    return (
        <div className="text-center space-y-4">
            <div className="text-[#3A7D63] text-5xl mb-2">✅</div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Email Verificado!</h2>
            <p className="text-[#8CA69E]">Sua conta foi ativada com sucesso. Você será redirecionado para o login.</p>
            <Link href="/login" className="block text-[#3A7D63] hover:underline font-bold">
                Ir para Login agora
            </Link>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1A18] p-4 font-sans">
            <div className="mb-8">
                {/* Se o componente Logo não puder ser importado, remova ou substitua por <h1> */}
                <Logo /> 
            </div>
            <div className="w-full max-w-md bg-[#13201E] p-8 rounded-xl border border-[#2A453F] shadow-2xl flex flex-col items-center">
                <Suspense fallback={<div className="text-[#8CA69E]">Carregando...</div>}>
                    <VerifyEmailForm />
                </Suspense>
            </div>
        </div>
    );
}