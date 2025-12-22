'use client';

import Link from 'next/link';
import React from 'react';
import {Logo} from '@/components/Logo';
import ForgotForm from './form';

// Observação: Em produção, use 'next/link'. 
// Usando <a> aqui para garantir compatibilidade imediata no preview.

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex selection:bg-[#3A7D63] selection:text-white font-sans text-[#EAEAEA] bg-[#0F1A18]">
      
      {/* Lado Esquerdo: Branding & Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#0F1A18] relative flex-col items-center justify-center p-12 overflow-hidden border-r border-[#2A453F]">
        
        {/* Background Decorativo */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#2A453F 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3A7D63]/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 text-center space-y-8 w-full flex flex-col items-center">
          
          <Logo className="w-full h-auto" />

          {/* Snippet Temático: Recuperação de Erro */}
          <div className="text-left bg-brand-surface p-6 rounded-xl border border-brand-border shadow-2xl max-w-md mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-300 w-full">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#CF5C5C]/50"></div>
              <div className="w-3 h-3 rounded-full bg-[#D4B04C]/50"></div>
              <div className="w-3 h-3 rounded-full bg-[#3A7D63]/50"></div>
            </div>
            <div className="font-mono text-sm space-y-1 text-[#EAEAEA]">
              <p className="text-[#8CA69E]">// Tentando acessar o sistema...</p>
              <p><span className="text-[#D4B04C]">try</span> {'{'}</p>
              <p className="pl-4"><span className="text-[#6BBF99]">authenticate</span>(user);</p>
              <p>{'}'} <span className="text-[#D4B04C]">catch</span> (error) {'{'}</p>
              <p className="pl-4"><span className="text-[#D4B04C]">if</span> (error.type === <span className="text-[#6BBF99]">'LOST_KEY'</span>) {'{'}</p>
              <p className="pl-8"><span className="text-[#4A6F8A]">rescueProtocol</span>.init();</p>
              <p className="pl-4">{'}'}</p>
              <p>{'}'}</p>
            </div>
          </div>
          
          <p className="text-[#8CA69E] font-medium">Recupere seu acesso e volte ao código.</p>
        </div>
      </div>

      {/* Lado Direito: Formulário */}
      <div className="w-full lg:w-1/2 bg-[#13201E] flex items-center justify-center p-6 relative">
        
        {/* Mobile Logo */}
        <div className="absolute top-8 lg:hidden">
            <svg width="40" height="40" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M48 12C48 7.58172 44.4183 4 40 4C35.5817 4 32 7.58172 32 12V44H20C15.5817 44 12 40.4183 12 36V28C12 23.5817 8.41828 20 4 20C-0.418278 20 -4 23.5817 -4 28V36C-4 49.2548 6.74517 60 20 60H32V68C32 72.4183 35.5817 76 40 76C44.4183 76 48 72.4183 48 68V52H60C73.2548 52 84 41.2548 84 28V20C84 15.5817 80.4183 12 76 12C71.5817 12 68 15.5817 68 20V28C68 32.4183 64.4183 36 60 36H48V12Z" fill="#3A7D63"/>
            </svg>
        </div>

        <div className="w-full max-w-md space-y-8">
            
          {/* Cabeçalho */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#3A7D63]/10 text-[#3A7D63] mb-4 lg:mx-0">
               {/* Icon: Key */}
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
               </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#EAEAEA] mb-2">Esqueceu a senha?</h1>
            <p className="text-[#8CA69E] text-sm">Acontece com os melhores devs. Digite seu e-mail e enviaremos um link para resetar.</p>
          </div>

          {/* Form */}
          <ForgotForm />

          {/* Voltar ao Login */}
          <div className="text-center">
            <Link href="/login" className="inline-flex items-center text-sm font-bold text-[#8CA69E] hover:text-[#EAEAEA] transition-colors group">
                {/* Icon: ArrowLeft */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform">
                    <path d="m12 19-7-7 7-7"/>
                    <path d="M19 12H5"/>
                </svg>
                Voltar para o Login
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}