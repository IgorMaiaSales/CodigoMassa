import React from 'react';
import { Logo, LogoIcon } from '@/components/Logo'; // Ajuste o caminho conforme onde criou o componente
import FormComponent from './form';
import Link from 'next/link';

export default function LoginPage() {
  
  return (
    // Mudança: bg-[#0F1A18] -> bg-brand-dark, text-[#EAEAEA] -> text-brand-text, etc.
    <div className="min-h-screen flex selection:bg-brand-green selection:text-white font-sans text-brand-text bg-brand-dark">
      
      {/* Lado Esquerdo: Branding & Visual */}
      <div className="hidden lg:flex w-1/2 bg-brand-dark relative flex-col items-center justify-center p-12 overflow-hidden border-r border-brand-border">
        
        {/* Background Decorativo */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            // Mantemos hex aqui pois o tailwind config não é acessível direto no style inline, 
            // mas poderíamos usar CSS variables se quiséssemos ser estritos.
            backgroundImage: 'radial-gradient(#2A453F 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        
        {/* Gradiente de Luz (Atualizado para brand-green) */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-green/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 text-center space-y-8 w-full flex flex-col items-center">
          
          {/* Logo Grande (Componente Extraído) */}
            <Logo className="w-full h-auto" />

          {/* Snippet Decorativo */}
          <div className="text-left bg-brand-surface p-6 rounded-xl border border-brand-border shadow-2xl max-w-md mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-300 w-full">
            <div className="flex gap-2 mb-4">
              {/* Cores de bolinhas manuais ou use bg-brand-error/50 etc */}
              <div className="w-3 h-3 rounded-full bg-brand-error/50"></div>
              <div className="w-3 h-3 rounded-full bg-brand-yellow/50"></div>
              <div className="w-3 h-3 rounded-full bg-brand-green/50"></div>
            </div>
            <div className="font-mono text-sm space-y-1 text-brand-text">
              <p className="text-brand-muted">// Inicie sua jornada</p>
              <p><span className="text-brand-yellow">if</span> (<span className="text-brand-blue">user</span>.isReady()) {'{'}</p>
              <p className="pl-4"><span className="text-brand-greenLight">login</span>();</p>
              <p className="pl-4"><span className="text-brand-greenLight">solveProblems</span>();</p>
              <p className="pl-4"><span className="text-brand-greenLight">evolve</span>();</p>
              <p>{'}'}</p>
            </div>
          </div>
          
          <p className="text-brand-muted font-medium">A plataforma definitiva para treinar para a OBI.</p>
        </div>
      </div>

      {/* Lado Direito: Formulário */}
      <div className="w-full lg:w-1/2 bg-[#13201E] flex items-center justify-center p-6 relative overflow-y-auto">
        {/* Nota: bg-[#13201E] não estava no seu config (o brand-surface é #182B27). 
            Se quiser padronizar, use bg-brand-surface, senão mantenha o arbitrário. */}
        
        {/* Mobile Logo */}
        <div className="absolute top-4 lg:hidden">
            <Logo width="200" height="100" />
        </div>

        <div className="w-full max-w-md space-y-8">
            
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-brand-text mb-2">Bem-vindo de volta</h1>
            <p className="text-brand-muted text-sm">Entre com seus dados para continuar treinando.</p>
          </div>

          {/* Botão Google */}
          <button className="w-full flex items-center justify-center gap-3 bg-brand-surface border border-brand-border hover:border-brand-muted/50 hover:bg-brand-surface text-brand-text font-bold py-3 px-4 rounded-lg transition-all duration-200 group">
            {/* SVG do Google mantido inline pois é ícone de terceiro */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Entrar com Google</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-brand-border"></div>
            <span className="flex-shrink-0 mx-4 text-brand-muted text-xs uppercase tracking-wider">Ou continue com e-mail</span>
            <div className="flex-grow border-t border-brand-border"></div>
          </div>

          <FormComponent />

          <div className="text-center mt-6">
            <p className="text-sm text-brand-muted">
              Não tem uma conta?{' '}
              <Link href="/register" className="font-bold text-brand-greenLight hover:text-brand-yellow hover:underline transition-colors">Criar conta grátis</Link>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 pt-6 opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span className="text-xs text-brand-muted">Ambiente seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
}