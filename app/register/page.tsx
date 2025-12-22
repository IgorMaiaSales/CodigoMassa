import Link from 'next/link';
import React from 'react';
// Mudamos o nome da importação para refletir o novo export
import RegisterForm from './form'; 
import { Logo } from '@/components/Logo';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex selection:bg-[#3A7D63] selection:text-white font-sans text-[#EAEAEA] bg-[#0F1A18]">
      
      {/* Lado Esquerdo (Mantido igual ao seu arquivo original) */}
      <div className="hidden lg:flex w-1/2 bg-[#0F1A18] relative flex-col items-center justify-center p-12 overflow-hidden border-r border-[#2A453F]">
        
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#2A453F 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3A7D63]/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 text-center space-y-8 w-full flex flex-col items-center">
          
          <div className="transform hover:scale-105 transition-transform duration-500 w-full flex justify-center">
            {/* Ajuste no tamanho da Logo para ficar igual ao login se necessário */}
            <div className="w-full max-w-[360px]">
                 <Logo className="w-full h-auto" />
            </div>
          </div>

          <div className="text-left bg-brand-surface p-6 rounded-xl border border-brand-border shadow-2xl max-w-md mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-300 w-full">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#CF5C5C]/50"></div>
              <div className="w-3 h-3 rounded-full bg-[#D4B04C]/50"></div>
              <div className="w-3 h-3 rounded-full bg-[#3A7D63]/50"></div>
            </div>
            <div className="font-mono text-sm space-y-1 text-[#EAEAEA]">
              <p className="text-[#8CA69E]">// Inicializando novo competidor...</p>
              <p><span className="text-[#D4B04C]">const</span> <span className="text-[#4A6F8A]">competitor</span> = <span className="text-[#D4B04C]">new</span> User();</p>
              <p><span className="text-[#4A6F8A]">competitor</span>.setGoal(<span className="text-[#6BBF99]">'Gold Medal'</span>);</p>
              <p><span className="text-[#4A6F8A]">competitor</span>.startJourney();</p>
              <p className="text-[#8CA69E] italic mt-2">// Bem-vindo ao time!</p>
            </div>
          </div>
          
          <p className="text-[#8CA69E] font-medium">Junte-se a milhares de devs treinando para o ouro.</p>
        </div>
      </div>

      {/* Lado Direito */}
      <div className="w-full lg:w-1/2 bg-[#13201E] flex items-center justify-center p-6 relative overflow-y-auto">
        
        <div className="absolute top-8 lg:hidden">
            <svg width="40" height="40" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M48 12C48 7.58172 44.4183 4 40 4C35.5817 4 32 7.58172 32 12V44H20C15.5817 44 12 40.4183 12 36V28C12 23.5817 8.41828 20 4 20C-0.418278 20 -4 23.5817 -4 28V36C-4 49.2548 6.74517 60 20 60H32V68C32 72.4183 35.5817 76 40 76C44.4183 76 48 72.4183 48 68V52H60C73.2548 52 84 41.2548 84 28V20C84 15.5817 80.4183 12 76 12C71.5817 12 68 15.5817 68 20V28C68 32.4183 64.4183 36 60 36H48V12Z" fill="#3A7D63"/>
            </svg>
        </div>

        <div className="w-full max-w-md space-y-8">
            
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-[#EAEAEA] mb-2">Crie sua conta</h1>
            <p className="text-[#8CA69E] text-sm">Preencha os dados abaixo e comece a codar.</p>
          </div>

          <button className="w-full flex items-center justify-center gap-3 bg-[#182B27] border border-[#2A453F] hover:border-[#8CA69E]/50 hover:bg-[#182B27] text-[#EAEAEA] font-bold py-3 px-4 rounded-lg transition-all duration-200 group">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Cadastrar com Google</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#2A453F]"></div>
            <span className="flex-shrink-0 mx-4 text-[#8CA69E] text-xs uppercase tracking-wider">Ou via e-mail</span>
            <div className="flex-grow border-t border-[#2A453F]"></div>
          </div>

          {/* Componente de Formulário Inteligente */}
          <RegisterForm />

          <div className="text-center mt-6">
            <p className="text-sm text-[#8CA69E]">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-bold text-[#6BBF99] hover:text-[#D4B04C] hover:underline transition-colors">
                Fazer login
              </Link>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 pt-6 opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8CA69E]">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span className="text-xs text-[#8CA69E]">Seus dados estão protegidos</span>
          </div>
        </div>
      </div>
    </div>
  );
}