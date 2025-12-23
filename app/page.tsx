'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar'; // Seu componente existente
import Footer from '@/components/Footer'; // O componente criado acima
import { 
  ArrowRight, PlayCircle, CheckCircle, Terminal, 
  Layout, Database, Zap, GraduationCap, Trophy, BookOpen, Gift 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar do contexto */}
      <Navbar />

      <main className="relative flex-grow">
        {/* Background Glow (definido no globals.css) */}
        <div className="absolute inset-0 bg-hero-glow z-0 pointer-events-none"></div>

        {/* --- Hero Section --- */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Texto Hero */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-border mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green-light opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green-light"></span>
                </span>
                <span className="text-xs font-mono text-brand-green-light">Plataforma em fase de testes</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                Domine a <span className="text-gradient-green">OBI</span><br />
                codando no <span className="text-gradient-gold">navegador</span>.
              </h1>
              
              <p className="text-lg text-brand-muted mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A plataforma definitiva para treinar para a Olimpíada Brasileira de Informática. 
                Resolva problemas clássicos, teste seus algoritmos e evolua sua lógica, tudo em um só lugar.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-green hover:bg-[#2F6650] text-white font-bold text-lg transition-all shadow-xl shadow-brand-green/20 border border-[#488f72] flex items-center justify-center gap-2 group">
                  Começar a Codar
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/problems" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-panel border border-brand-border text-brand-text font-bold text-lg hover:bg-brand-surface transition-colors flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5 text-brand-muted" />
                  Ver Problemas
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-brand-muted">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-brand-green-light" /> 100% Gratuito
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-brand-green-light" /> Sem Instalação
                </div>
              </div>
            </div>

            {/* Hero Visual / Code Mockup (Balões removidos) */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none perspective-1000">
              <div className="relative bg-brand-panel rounded-xl border border-brand-border shadow-2xl overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-500 ease-out group">
                {/* Header Mockup */}
                <div className="h-10 bg-brand-dark border-b border-brand-border flex items-center px-4 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-error"></div>
                    <div className="w-3 h-3 rounded-full bg-brand-yellow"></div>
                    <div className="w-3 h-3 rounded-full bg-brand-green-light"></div>
                  </div>
                  <div className="text-xs text-brand-muted font-mono">solucao_obi.py</div>
                </div>
                {/* Body Mockup */}
                <div className="p-6 font-mono text-sm bg-brand-dark group-hover:bg-[#111e1c] transition-colors">
                  <div className="flex gap-4">
                    <div className="text-brand-muted/30 select-none text-right">
                      1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7
                    </div>
                    <div className="text-brand-text">
                      <span className="text-brand-yellow">def</span> <span className="text-brand-green-light">soma_obi</span>(a, b):<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-brand-muted"># Lógica vencedora aqui</span><br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-brand-yellow">if</span> a + b == <span className="text-brand-green-light">target</span>:<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-brand-yellow">return</span> <span className="text-brand-green-light">True</span><br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-brand-yellow">return</span> <span className="text-brand-green-light">False</span><br/>
                      <br/>
                      <span className="text-brand-yellow">print</span>(<span className="text-brand-green-light">"Código Massa!"</span>)
                    </div>
                  </div>
                </div>
                {/* Console Mockup */}
                <div className="border-t border-brand-border bg-brand-dark p-3">
                  <div className="text-xs font-mono text-brand-green-light flex items-center gap-2">
                    <Terminal className="w-3 h-3" />
                    {'>'} Output: Código Massa!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Language Support Bar --- */}
        <div className="border-y border-brand-border bg-brand-panel/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-center text-xs font-bold text-brand-muted uppercase tracking-widest mb-6">Codifique na sua linguagem favorita</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-80">
              <div className="flex items-center gap-2 text-brand-text font-mono font-bold hover:text-brand-green-light transition-colors cursor-default">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" className="w-6 h-6 grayscale hover:grayscale-0 transition-all" alt="Python" /> Python
              </div>
              <div className="flex items-center gap-2 text-brand-text font-mono font-bold hover:text-brand-green-light transition-colors cursor-default">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" className="w-6 h-6 grayscale hover:grayscale-0 transition-all" alt="C" /> C
              </div>
              <div className="flex items-center gap-2 text-brand-text font-mono font-bold hover:text-brand-green-light transition-colors cursor-default">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" className="w-6 h-6 grayscale hover:grayscale-0 transition-all" alt="C++" /> C++
              </div>
              <div className="flex items-center gap-2 text-brand-text font-mono font-bold hover:text-brand-green-light transition-colors cursor-default">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" className="w-6 h-6 grayscale hover:grayscale-0 transition-all" alt="Java" /> Java
              </div>
              <div className="flex items-center gap-2 text-brand-text font-mono font-bold hover:text-brand-green-light transition-colors cursor-default">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" className="w-6 h-6 grayscale hover:grayscale-0 transition-all" alt="JS" /> Javascript
              </div>
              <div className="flex items-center gap-2 text-brand-text font-mono font-bold hover:text-brand-green-light transition-colors cursor-default">
                <div className="w-6 h-6 bg-brand-border rounded flex items-center justify-center text-[10px]">P</div> Pascal
              </div>
            </div>
          </div>
        </div>

        {/* --- Features Section --- */}
        <section id="funcionalidades" className="py-24 bg-brand-dark relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Tudo o que você precisa para <span className="text-brand-green-light">evoluir</span></h2>
              <p className="text-brand-muted">Focamos na experiência de desenvolvimento para que você foque apenas na lógica e no aprendizado.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-brand-panel border border-brand-border p-8 rounded-2xl hover:border-brand-green-light/50 transition-colors group">
                <div className="w-12 h-12 bg-brand-surface rounded-lg flex items-center justify-center border border-brand-border mb-6 group-hover:scale-110 transition-transform">
                  <Layout className="w-6 h-6 text-brand-green-light" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Editor Integrado</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Não perca tempo configurando ambientes. Nosso editor roda direto no navegador com syntax highlighting e autocompletar.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-brand-panel border border-brand-border p-8 rounded-2xl hover:border-brand-yellow/50 transition-colors group">
                <div className="w-12 h-12 bg-brand-surface rounded-lg flex items-center justify-center border border-brand-border mb-6 group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6 text-brand-yellow" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Acervo OBI</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Acesso organizado a uma coleção de problemas de edições passadas da Olimpíada Brasileira de Informática, classificados por nível, fase e ano.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-brand-panel border border-brand-border p-8 rounded-2xl hover:border-brand-green-light/50 transition-colors group">
                <div className="w-12 h-12 bg-brand-surface rounded-lg flex items-center justify-center border border-brand-border mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-brand-green-light" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Compilação Rápida</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Receba feedback instantâneo sobre seu código. Casos de teste automatizados validam sua solução em segundos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Roadmap Section --- */}
        <section id="roadmap" className="py-24 bg-brand-panel border-y border-brand-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-brand-green/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div>
                <span className="text-brand-yellow font-mono text-xs font-bold uppercase tracking-wider">O Futuro</span>
                <h2 className="text-3xl font-bold text-white mt-2">O que vem por aí</h2>
              </div>
              <div className="text-brand-muted text-sm max-w-md text-right md:text-left">
                Estamos apenas no começo. Veja o que estamos construindo para transformar a educação em programação.
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-brand-border bg-brand-dark/50 backdrop-blur-sm relative opacity-60 hover:opacity-100 transition-opacity">
                <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-brand-surface rounded border border-brand-border text-brand-muted">Em Breve</div>
                <GraduationCap className="w-8 h-8 text-brand-green-light mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Aulas Preparatórias</h4>
                <p className="text-sm text-brand-muted">Módulos de ensino focados em lógica e estruturas de dados para cada linguagem suportada.</p>
              </div>

              <div className="p-6 rounded-xl border border-brand-border bg-brand-dark/50 backdrop-blur-sm relative opacity-60 hover:opacity-100 transition-opacity">
                <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-brand-surface rounded border border-brand-border text-brand-muted">Em Breve</div>
                <Trophy className="w-8 h-8 text-brand-yellow mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Ranking Global</h4>
                <p className="text-sm text-brand-muted">Sistema de XP e ligas para competir com outros estudantes de todo o Brasil.</p>
              </div>

              <div className="p-6 rounded-xl border border-brand-border bg-brand-dark/50 backdrop-blur-sm relative opacity-60 hover:opacity-100 transition-opacity">
                <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-brand-surface rounded border border-brand-border text-brand-muted">Em Breve</div>
                <BookOpen className="w-8 h-8 text-brand-green-light mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Soluções Explicadas</h4>
                <p className="text-sm text-brand-muted">Editoriais detalhados passo-a-passo para cada problema da plataforma.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Call to Action --- */}
        <section className="py-24 bg-brand-dark text-center">
          <div className="max-w-4xl mx-auto px-6">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-brand-green-light/10 border border-brand-green-light/20 mb-8">
              <Gift className="w-6 h-6 text-brand-green-light" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Gratuito. <span className="text-gradient-gold">Para Sempre.</span></h2>
            <p className="text-lg text-brand-muted mb-10 max-w-2xl mx-auto">
              Acreditamos que o acesso à educação de qualidade em ciência da computação deve ser universal. O Código Massa é um projeto open-education sem paywalls.
            </p>
            <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-brand-dark bg-brand-green-light rounded-xl hover:bg-[#5AA885] transition-all shadow-lg hover:scale-105">
              Criar minha conta grátis
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}