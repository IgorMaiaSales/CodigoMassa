'use client';

import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { HorizontalLogo } from './Logo';

export default function Footer() {
  return (
    <footer className="bg-brand-panel border-t border-brand-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Lado Esquerdo: Logo e Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <HorizontalLogo />
          <p className="text-xs text-brand-muted text-center md:text-left">
            © 2025 Código Massa. Todos os direitos reservados.
          </p>
        </div>

        {/* Lado Direito: Suporte e Links Essenciais */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm font-medium">
          
          {/* Link de Suporte */}
          <a 
            href="mailto:suporte@codigomassa.com.br" 
            className="flex items-center gap-2 text-brand-muted hover:text-brand-green-light transition-colors"
          >
            <Mail size={16} />
            <span>Suporte</span>
          </a>

          {/* Divisor Visual (apenas desktop) */}
          <span className="hidden md:block text-brand-border">|</span>

          {/* Links Legais */}
          <div className="flex gap-4">
            <Link href="/termos" className="text-brand-muted hover:text-brand-text transition-colors text-xs">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-brand-muted hover:text-brand-text transition-colors text-xs">
              Privacidade
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}