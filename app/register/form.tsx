'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';

export default function RegisterForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [customError, setCustomError] = useState('');

    // Hooks do Firebase
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    const [updateProfile, updating, errorProfile] = useUpdateProfile(auth);

    const validatePassword = (pwd: string) => {
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasNumber = /\d/.test(pwd);
        const hasSymbol = /[\W_]/.test(pwd);
        const isValidLength = pwd.length >= 8;

        if (!isValidLength) return "A senha deve ter pelo menos 8 caracteres.";
        if (!hasUpperCase) return "A senha deve ter pelo menos uma letra maiúscula.";
        if (!hasLowerCase) return "A senha deve ter pelo menos uma letra minúscula.";
        if (!hasNumber) return "A senha deve ter pelo menos um número.";
        if (!hasSymbol) return "A senha deve ter pelo menos um símbolo (!@#$).";

        return null; // Sem erros
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setCustomError(''); // Limpa erros anteriores

        // Validação de Campos Vazios
        if (!name.trim()) {
            setCustomError("Por favor, preencha seu nome completo.");
            return;
        }
        
        // Validação de formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
             setCustomError("Por favor, insira um e-mail válido.");
             return;
        }

        // Validação da Senha
        const passwordError = validatePassword(password);
        if (passwordError) {
            setCustomError(passwordError);
            return; 
        }
        
        try {
          const res = await createUserWithEmailAndPassword(email, password);
          
          if (res) {
              await updateProfile({ displayName: name });
              
              // NOVO: Enviar e-mail de verificação
              await sendEmailVerification(res.user);

              // MUDANÇA: Redirecionar para a página de espera, não para o dashboard
              router.push('/check-email');
          }
        } catch (err) {
            console.error("Erro no registro:", err);
            // O tratamento de erro continua o mesmo
        }
    };

    const getErrorMessage = (firebaseError: any) => {
        if (!firebaseError) return null;
        const code = firebaseError.code || firebaseError.message; 
        
        if (code.includes('auth/email-already-in-use')) return 'Este e-mail já está cadastrado.';
        if (code.includes('auth/invalid-email')) return 'O formato do e-mail é inválido.';
        
        return 'Ocorreu um erro ao criar a conta.';
    };

    // Prioriza o erro customizado. Se não houver, mostra o do Firebase
    const displayError = customError || getErrorMessage(error);

    return (
          <form className="space-y-5" onSubmit={handleRegister} noValidate>
            
            {/* Exibição de Erro Unificada */}
            {displayError && (
                <div className="p-3 text-sm text-[#CF5C5C] bg-[#CF5C5C]/10 border border-[#CF5C5C] rounded-md animate-pulse">
                    {displayError}
                </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[#EAEAEA]">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8CA69E] group-focus-within:text-[#3A7D63] transition-colors">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-[#0F1A18] border border-[#2A453F] rounded-lg focus:ring-2 focus:ring-[#3A7D63] focus:border-transparent text-[#EAEAEA] font-mono placeholder-[#8CA69E]/50 transition-all outline-none sm:text-sm" 
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#EAEAEA]">E-mail</label>
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
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#EAEAEA]">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8CA69E] group-focus-within:text-[#3A7D63] transition-colors">
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
                  className="block w-full pl-10 pr-3 py-3 bg-[#0F1A18] border border-[#2A453F] rounded-lg focus:ring-2 focus:ring-[#3A7D63] focus:border-transparent text-[#EAEAEA] font-mono placeholder-[#8CA69E]/50 transition-all outline-none sm:text-sm" 
                  placeholder="Crie uma senha forte"
                />
              </div>
              <p className="text-xs text-[#8CA69E] text-right">Mínimo de 8 caracteres, letra maiúscula, número e símbolo</p>
            </div>

            <button 
              type="submit" 
              disabled={loading || updating}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#3A7D63] hover:bg-[#6BBF99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13201E] focus:ring-[#3A7D63] transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-wait"
            >
              {loading || updating ? 'Criando conta...' : 'Criar Conta Grátis'}
            </button>
          </form>
    );
}