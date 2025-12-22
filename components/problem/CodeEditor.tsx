'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link'; // Importante para a navegação
import { ChevronDown, RotateCcw, Send, Terminal, AlertCircle, CheckCircle, AlertTriangle, XCircle, Check, Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext'; 

const LANGUAGES = [
  { id: 71, name: 'Python 3', suffix: '.py', placeholder: "def main():\n    print('Ola Mundo')\n\nif __name__ == '__main__':\n    main()" },
  { id: 54, name: 'C++ (GCC 9.2.0)', suffix: '.cpp', placeholder: "#include <iostream>\n\nint main() {\n    std::cout << \"Ola Mundo\";\n    return 0;\n}" },
  { id: 50, name: 'C (GCC 9.2.0)', suffix: '.c', placeholder: "#include <stdio.h>\n\nint main() {\n    printf(\"Ola Mundo\");\n    return 0;\n}" },
  { id: 62, name: 'Java (OpenJDK 13.0.1)', suffix: '.java', placeholder: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Ola Mundo\");\n    }\n}" },
  { id: 63, name: 'JavaScript (Node.js)', suffix: '.js', placeholder: "console.log('Ola Mundo');" },
  { id: 67, name: 'Pascal (FPC 3.0.4)', suffix: '.pas', placeholder: "program Hello;\nbegin\n  writeln('Ola Mundo');\nend." },
];

interface CodeEditorProps {
  problemSlug: string;
}

export default function CodeEditor({ problemSlug }: CodeEditorProps) {
  // Apenas consumimos o estado do usuário, sem funções de login
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState('');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<React.ReactNode | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // --- LÓGICA DE CACHE (LocalStorage) ---
  const storageKey = `obi_cache_${problemSlug}_${selectedLang.id}`;

  useEffect(() => {
    setIsLoaded(false);
    const savedCode = localStorage.getItem(storageKey);
    
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(selectedLang.placeholder);
    }
    
    setTimeout(() => setIsLoaded(true), 50);
  }, [problemSlug, selectedLang.id, storageKey]);

  useEffect(() => {
    if (isLoaded) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(storageKey, code);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [code, isLoaded, storageKey]);
  // -------------------------------------

  useEffect(() => {
    const close = () => setIsLangMenuOpen(false);
    if(isLangMenuOpen) window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [isLangMenuOpen]);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };
  
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      setCode(value.substring(0, start) + "    " + value.substring(end));
      setTimeout(() => {
        if (textareaRef.current) textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleLanguageChange = (lang: typeof LANGUAGES[0]) => {
    setSelectedLang(lang);
    setIsLangMenuOpen(false);
  };

  const handleSubmit = async () => {
    if (!problemSlug) return;
    
    // Bloqueio de Segurança: Feedback visual no Console se tentar forçar o envio
    if (!isAuthenticated) {
      setConsoleOutput(
        <div className="flex flex-col items-start gap-3 text-brand-yellow p-4 bg-brand-yellow/5 border border-brand-yellow/20 rounded">
          <div className="flex items-center gap-2">
            <Lock size={18} />
            <span className="text-xs font-mono font-bold">Autenticação necessária</span>
          </div>
          <p className="text-xs opacity-80">Você precisa estar logado para processar sua submissão.</p>
          <Link 
            href="/login"
            className="text-xs bg-brand-yellow text-brand-dark font-bold px-3 py-1 rounded hover:opacity-90 transition inline-block"
          >
            Ir para página de Login
          </Link>
        </div>
      );
      return;
    }

    setIsRunning(true);
    setConsoleOutput(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: problemSlug,
          source_code: code,
          language_id: selectedLang.id,
          user_uid: user.uid 
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Erro na submissão');
      renderResult(result);

    } catch (error: any) {
      setConsoleOutput(
        <div className="flex items-center gap-2 text-brand-error p-4">
          <AlertCircle size={18} />
          <span className="text-xs font-mono">{error.message || "Erro de conexão"}</span>
        </div>
      );
    } finally {
      setIsRunning(false);
    }
  };

  const renderResult = (data: any) => {
    // Mesma lógica de renderização
    let bgColor = "bg-brand-surface";
    let borderColor = "border-brand-border";
    let icon = <Terminal size={20} />;
    let titleColor = "text-brand-text";
    let title = "Resultado";

    if (data.status === "Accepted") {
        bgColor = "bg-brand-green/10";
        borderColor = "border-brand-green/30";
        icon = <CheckCircle className="text-brand-green-light" size={20} />;
        titleColor = "text-brand-green-light";
        title = "Solução Aceita";
    } else if (data.status === "Partial") {
        bgColor = "bg-brand-yellow/10";
        borderColor = "border-brand-yellow/30";
        icon = <AlertTriangle className="text-brand-yellow" size={20} />;
        titleColor = "text-brand-yellow";
        title = "Pontuação Parcial";
    } else {
        bgColor = "bg-brand-error/10";
        borderColor = "border-brand-error/30";
        icon = <XCircle className="text-brand-error" size={20} />;
        titleColor = "text-brand-error";
        title = data.status_description || "Resposta Incorreta";
    }

    setConsoleOutput(
      <div className="animate-fade-in p-2 space-y-3">
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${bgColor} ${borderColor}`}>
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-bold text-sm ${titleColor}`}>{title}</h3>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold font-mono ${titleColor}`}>
                            {data.score !== undefined ? data.score : 0}
                        </span>
                        <span className="text-xs text-brand-muted font-mono">
                            / {data.total_score || 100}
                        </span>
                    </div>
                </div>
                {data.status !== "Accepted" && data.failed_at && !data.subtasks && (
                    <p className="text-brand-muted text-[10px] font-mono">
                       Falhou no teste {data.failed_at}.
                    </p>
                )}
            </div>
        </div>
        
        {data.subtasks && data.subtasks.length > 0 && (
            <div className="space-y-1.5">
                <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider ml-1">Subtarefas</span>
                <div className="grid grid-cols-1 gap-1.5">
                    {data.subtasks.map((sub: any) => (
                        <div key={sub.id} className={`flex items-center justify-between p-2 rounded text-xs border ${
                            sub.passed ? "bg-brand-green/5 border-brand-green/20" : "bg-brand-surface border-brand-border"
                        }`}>
                            <div className="flex items-center gap-2">
                                {sub.passed ? <Check size={14} className="text-brand-green-light" /> : <XCircle size={14} className="text-brand-error opacity-60" />}
                                <span className={sub.passed ? "text-brand-text" : "text-brand-muted"}>Subtarefa {sub.id}</span>
                            </div>
                            <span className={`font-mono font-bold ${sub.passed ? "text-brand-green-light" : "text-brand-muted"}`}>
                                {sub.passed ? `+${sub.score}` : '0'} <span className="text-[10px] opacity-50">/ {sub.score}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}
        <div className="grid grid-cols-2 gap-2">
            <div className="bg-brand-surface p-2 rounded border border-brand-border">
                <span className="text-brand-muted text-[10px] uppercase font-bold block">Tempo</span>
                <span className="text-white font-mono text-sm">{data.time}</span>
            </div>
            <div className="bg-brand-surface p-2 rounded border border-brand-border">
                <span className="text-brand-muted text-[10px] uppercase font-bold block">Memória</span>
                <span className="text-white font-mono text-sm">{data.memory}</span>
            </div>
        </div>
        {data.stderr && (
            <div className="bg-black/40 p-3 rounded border border-brand-border overflow-x-auto">
                <span className="text-[10px] text-brand-muted uppercase font-bold block mb-1">Log de Erro:</span>
                <pre className="text-brand-error text-[10px] font-mono whitespace-pre-wrap">{data.stderr}</pre>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-panel relative min-w-0 h-full border-l border-brand-border">
      
      {/* TOOLBAR */}
      <div className="h-12 bg-brand-dark border-b border-brand-border flex items-center justify-between px-4 shrink-0">
        <div className="relative">
            <button 
                onClick={(e) => { e.stopPropagation(); setIsLangMenuOpen(!isLangMenuOpen); }}
                className="flex items-center gap-2 text-xs font-medium text-brand-text bg-brand-surface hover:bg-brand-border border border-brand-border px-3 py-1.5 rounded-lg transition min-w-[140px] justify-between"
            >
                <div className="flex items-center gap-2">
                    <span className="font-mono text-brand-green-light opacity-80">{selectedLang.suffix}</span>
                    <span>{selectedLang.name}</span>
                </div>
                <ChevronDown size={14} className="text-brand-muted" />
            </button>
            {isLangMenuOpen && (
                <div className="absolute top-full mt-1 left-0 w-64 bg-brand-surface border border-brand-border rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => handleLanguageChange(lang)}
                            className={`w-full text-left px-4 py-2 text-xs hover:bg-brand-border transition flex items-center justify-between ${selectedLang.id === lang.id ? 'text-brand-green-light bg-brand-border/50' : 'text-brand-text'}`}
                        >
                            <span>{lang.name}</span>
                            <span className="font-mono text-[10px] text-brand-muted">{lang.suffix}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (confirm('Isso irá apagar seu código atual. Deseja continuar?')) {
                setCode(selectedLang.placeholder);
                localStorage.removeItem(storageKey);
              }
            }} 
            className="p-1.5 rounded-lg hover:bg-brand-border text-brand-muted hover:text-white transition" 
            title="Resetar Código"
          >
            <RotateCcw size={16} />
          </button>
          
          <button 
            onClick={handleSubmit} 
            disabled={isRunning || !isAuthenticated} 
            className={`px-4 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-2 group shadow-md 
                ${isAuthenticated 
                    ? 'bg-brand-green hover:bg-brand-green/80 text-white border-brand-green/50 shadow-brand-green/10' 
                    : 'bg-brand-surface text-brand-muted border-brand-border cursor-not-allowed opacity-70 hover:opacity-100'
                }`}
            title={!isAuthenticated ? "Faça login para submeter" : ""}
          >
            {isAuthenticated ? (
                <>
                    <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    <span>{isRunning ? 'Enviando...' : 'Submeter'}</span>
                </>
            ) : (
                <>
                    <Lock size={14} />
                    <span>Login necessário</span>
                </>
            )}
          </button>
        </div>
      </div>

      {/* AVISO DE LOGIN (Link para página de login) */}
      {!isAuthenticated && !authLoading && (
        <div className="bg-brand-yellow/10 border-b border-brand-yellow/20 px-4 py-2 flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-brand-yellow" />
                <p className="text-xs text-brand-yellow">
                    Você não está logado. O código está salvo localmente, mas não poderá ser enviado.
                </p>
            </div>
            {/* Agora é um Link do Next.js, não mais um botão com função */}
            <Link 
                href="/login"
                className="flex items-center gap-1 text-xs text-brand-yellow hover:text-brand-yellow/80 font-bold underline"
            >
                <LogIn size={12} />
                Entrar
            </Link>
        </div>
      )}

      {/* EDITOR */}
      <div className="flex-1 relative flex flex-col min-h-0 bg-brand-dark">
        <div className="flex-1 flex overflow-hidden">
          <div ref={lineNumbersRef} className="w-10 py-4 text-right pr-2 font-mono text-xs text-brand-muted/40 select-none bg-brand-dark overflow-hidden border-r border-brand-border/50">
            {lineNumbers.map(n => <div key={n} className="leading-6">{n}</div>)}
          </div>
          <textarea 
            ref={textareaRef} 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            onKeyDown={handleKeyDown} 
            onScroll={handleScroll} 
            className="flex-1 bg-transparent text-brand-text caret-brand-green-light outline-none resize-none font-mono text-sm leading-6 p-4 whitespace-pre border-none focus:ring-0" 
            spellCheck="false" 
            autoComplete="off" 
          />
        </div>
      </div>

      {/* CONSOLE */}
      <div className="h-[35%] bg-brand-dark border-t border-brand-border flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-20">
        <div className="flex items-center px-4 border-b border-brand-border bg-brand-dark shrink-0 h-8">
          <span className="text-[10px] font-bold text-brand-green-light uppercase tracking-wider">Console Output</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
          {isRunning ? (
             <div className="h-full flex flex-col items-center justify-center opacity-80">
                 <span className="text-[10px] text-brand-green-light font-medium animate-pulse">Julgando casos de teste...</span>
             </div>
          ) : consoleOutput ? (
            consoleOutput
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-brand-muted opacity-30">
              <Terminal size={24} className="mb-2" />
              <p className="text-[10px]">Aguardando submissão...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}