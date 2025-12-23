'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Ajuste o caminho se necessário

export default function ForgotForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            // URL para onde o usuário volta após clicar no email.
            // Ajuste 'http://localhost:3000' para seu domínio em produção.
            const actionCodeSettings = {
                url: 'http://localhost:3000/reset-password',
                handleCodeInApp: true,
            };

            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setStatus('success');
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            if (error.code === 'auth/user-not-found') {
                setErrorMsg('E-mail não encontrado.');
            } else {
                setErrorMsg('Erro ao enviar e-mail. Tente novamente.');
            }
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-[#3A7D63]/10 border border-[#3A7D63] rounded-lg p-6 text-center animate-fade-in">
                <div className="mx-auto w-12 h-12 bg-[#3A7D63] rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 className="text-[#EAEAEA] font-bold text-lg mb-2">E-mail Enviado!</h3>
                <p className="text-[#8CA69E] text-sm">Verifique sua caixa de entrada (e spam) para redefinir sua senha.</p>
                <button 
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-xs text-[#3A7D63] hover:text-[#6BBF99] font-bold underline"
                >
                    Enviar novamente
                </button>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#EAEAEA]">E-mail cadastrado</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8CA69E] group-focus-within:text-[#3A7D63] transition-colors">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </div>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-[#0F1A18] border border-[#2A453F] rounded-lg focus:ring-2 focus:ring-[#3A7D63] focus:border-transparent text-[#EAEAEA] font-mono placeholder-[#8CA69E]/50 transition-all outline-none sm:text-sm" 
                        placeholder="seu@email.com"
                    />
                </div>
                {status === 'error' && <p className="text-[#CF5C5C] text-xs font-medium">{errorMsg}</p>}
            </div>

            <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#3A7D63] hover:bg-[#6BBF99] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13201E] focus:ring-[#3A7D63] transition-all duration-200 transform hover:-translate-y-0.5"
            >
                {status === 'loading' ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </button>
        </form>
    );
}