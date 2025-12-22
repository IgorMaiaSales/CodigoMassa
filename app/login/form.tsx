'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function FormComponent() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // 1. Novo estado para erros locais
    const [customError, setCustomError] = useState('');

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCustomError(''); // Limpa erros anteriores

        // 2. Validação Manual para evitar o balão do navegador
        if (!email) {
            setCustomError('Por favor, digite seu e-mail.');
            return;
        }
        if (!password) {
            setCustomError('Por favor, digite sua senha.');
            return;
        }

        try {
            await signInWithEmailAndPassword(email, password);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user) {
            router.push('/problems'); // Redireciona após login bem-sucedido
        }
    }, [user, router]);

    // Função auxiliar de erro do Firebase
    const getFirebaseErrorMessage = () => {
        if (!error) return null;
        if (error.code === 'auth/invalid-credential') return 'E-mail ou senha incorretos.';
        if (error.code === 'auth/user-not-found') return 'Usuário não encontrado.';
        if (error.code === 'auth/wrong-password') return 'Senha incorreta.';
        if (error.code === 'auth/too-many-requests') return 'Muitas tentativas. Tente mais tarde.';
        return 'Erro ao tentar entrar.';
    };

    // 3. Unificação dos erros (Local ou Firebase)
    const displayError = customError || getFirebaseErrorMessage();

    return (
        // 4. Adicione noValidate para desligar o balão do navegador
        <form className="space-y-6" onSubmit={handleLogin} noValidate>
            
            {/* Exibição de Erro Unificada */}
            {displayError && (
                <div className="p-3 text-sm text-brand-error bg-brand-error/10 border border-brand-error rounded-md animate-pulse">
                    {displayError}
                </div>
            )}

            {/* Input E-mail */}
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-brand-text">E-mail</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted group-focus-within:text-brand-green transition-colors">
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
                        className="block w-full pl-10 pr-3 py-3 bg-brand-dark border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent text-brand-text font-mono placeholder-brand-muted/50 transition-all outline-none sm:text-sm" 
                        placeholder="seu@email.com"
                    />
                </div>
            </div>

            {/* Input Senha */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium text-brand-text">Senha</label>
                    <Link href="/forgot" className="text-xs font-medium text-brand-blue hover:text-brand-greenLight transition-colors">Esqueceu a senha?</Link>
                </div>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted group-focus-within:text-brand-green transition-colors">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-brand-dark border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent text-brand-text font-mono placeholder-brand-muted/50 transition-all outline-none sm:text-sm" 
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-green hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-green transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-wait"
            >
                {loading ? 'Entrando...' : 'Entrar na Plataforma'}
            </button>
        </form>
    );
}