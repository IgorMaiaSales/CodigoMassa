'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ChevronDown, CheckCircle, CircleDashed, AlertTriangle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ProblemSummary } from '@/types/problem';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function ProblemExplorer() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('Todos');
  const [filterLevel, setFilterLevel] = useState('Todos');
  const [filterPhase, setFilterPhase] = useState('Todos');

  // Estados para Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // --- BUSCA DE DADOS NA API ---
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterYear !== 'Todos') params.append('year', filterYear);
        if (filterLevel !== 'Todos') params.append('level', filterLevel);
        if (filterPhase !== 'Todos') params.append('phase', filterPhase);
        
        const probRes = await fetch(`/api/problems?${params.toString()}`);
        if (!probRes.ok) throw new Error('Falha ao buscar problemas');
        
        const probData = await probRes.json();
        setProblems(probData);

        if (user?.uid) {
            const userRes = await fetch(`/api/user/submissions?uid=${user.uid}`);
            if (userRes.ok) {
                const progressData = await userRes.json();
                setUserProgress(progressData);
            }
        }
      } catch (error) {
        console.error("Erro ao buscar problemas", error);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    }; 

    fetchProblems(); 
  }, [filterYear, filterLevel, filterPhase, user?.uid]); 

  // Resetar para página 1 sempre que um filtro mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterYear, filterLevel, filterPhase]);

  // --- LÓGICA DE ANOS DINÂMICOS ---
  const availableYears = useMemo(() => {
    // Mapeia todos os anos e converte para string
    const years = problems.map(prob => prob.year.toString());
    // Remove duplicatas com Set e ordena de forma decrescente (ex: 2026, 2025, 2024)
    return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
  }, [problems]);

  // --- LÓGICA DE FILTRAGEM E PAGINAÇÃO ---
  const filteredProblems = problems.filter(prob => {
    const term = searchTerm.toLowerCase();
    return prob.title.toLowerCase().includes(term);
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);

  const currentProblems = filteredProblems.slice(indexOfFirstItem, indexOfLastItem);

  const formatLevel = (levels: string[]) => { 
    const map: Record<string, string> = { 'J': 'Júnior', '1': 'Nível 1', '2': 'Nível 2', 'S': 'Sênior', 'Iniciante': 'Iniciante' };
    if (!levels || !Array.isArray(levels)) return 'Nível desconhecido';
    return levels.map(l => map[l] || l).join(' / ');
  };

  const getScoreBadge = (problemId: string) => { 
    const submission = userProgress[problemId];
    if (!submission) return <div className="flex items-center gap-2 text-[#8CA69E] opacity-40"><CircleDashed size={18} /><span className="text-xs font-medium hidden md:inline">Não tentado</span></div>;
    if (submission.status === 'Accepted') return <div className="flex items-center gap-2 text-brand-green-light bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20"><CheckCircle size={16} /><span className="text-sm font-bold">{submission.score} pts</span></div>;
    if (submission.score > 0) return <div className="flex items-center gap-2 text-brand-yellow bg-brand-yellow/10 px-3 py-1 rounded-full border border-brand-yellow/20"><AlertTriangle size={16} /><span className="text-sm font-bold">{submission.score} pts</span></div>;
    return <div className="flex items-center gap-2 text-brand-error bg-brand-error/10 px-3 py-1 rounded-full border border-brand-error/20"><XCircle size={16} /><span className="text-sm font-bold">0 pts</span></div>;
  };

  return (
    <div className="space-y-8">
      
      {/* --- BARRA DE FILTROS --- */}
      <div className="bg-[#13201E] border border-[#2A453F] rounded-xl p-4 shadow-xl">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
             {/* Busca */}
             <div className="md:col-span-5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-[#8CA69E] group-focus-within:text-[#3A7D63] transition-colors" />
                </div>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar problema..."
                    className="block w-full pl-10 pr-3 py-2.5 bg-[#0F1A18] border border-[#2A453F] rounded-lg text-[#EAEAEA] placeholder-[#8CA69E]/50 focus:ring-1 focus:ring-[#3A7D63] focus:border-[#3A7D63] outline-none transition-all"
                />
            </div>
             {/* Ano (Gerado Dinamicamente) */}
             <div className="md:col-span-2 relative">
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="block w-full pl-3 pr-8 py-2.5 bg-[#0F1A18] border border-[#2A453F] rounded-lg text-[#EAEAEA] appearance-none focus:ring-1 focus:ring-[#3A7D63] outline-none cursor-pointer">
                    <option value="Todos">Ano: Todos</option>
                    {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8CA69E] pointer-events-none" />
            </div>
             {/* Nível */}
             <div className="md:col-span-2 relative">
                <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="block w-full pl-3 pr-8 py-2.5 bg-[#0F1A18] border border-[#2A453F] rounded-lg text-[#EAEAEA] appearance-none focus:ring-1 focus:ring-[#3A7D63] outline-none cursor-pointer">
                    <option value="Todos">Nível: Todos</option>
                    <option value="Iniciante">Iniciante</option>
                    <option value="J">Júnior (J)</option>
                    <option value="1">Nível 1</option>
                    <option value="2">Nível 2</option>
                    <option value="S">Sênior (S)</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8CA69E] pointer-events-none" />
            </div>
            {/* Fase */}
            <div className="md:col-span-3 relative">
                  <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)} className="block w-full pl-3 pr-8 py-2.5 bg-[#0F1A18] border border-[#2A453F] rounded-lg text-[#EAEAEA] appearance-none focus:ring-1 focus:ring-[#3A7D63] outline-none cursor-pointer">
                    <option value="Todos">Fase: Todas</option>
                    <option value="1">Fase 1</option>
                    <option value="2">Fase 2</option>
                    <option value="3">Fase 3</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8CA69E] pointer-events-none" />
            </div>
        </div>
      </div>

      {/* --- LISTA --- */}
      <div className="bg-[#13201E] border border-[#2A453F] rounded-xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#2A453F] bg-[#182B27] text-xs font-bold text-[#8CA69E] uppercase tracking-wider">
              <div className="col-span-5 md:col-span-4">Problema</div>
              <div className="col-span-2 hidden md:block text-center">Ano</div>
              <div className="col-span-2 hidden md:block text-center">Nível</div>
              <div className="col-span-2 hidden md:block text-center">Fase</div>
              <div className="col-span-7 md:col-span-2 text-right">Status</div>
          </div>

          <div className="divide-y divide-[#2A453F]">
              {loading ? (
                  <div className="p-12 text-center text-[#8CA69E]">
                      <CircleDashed className="mx-auto h-8 w-8 animate-spin mb-4" />
                      <p>Carregando problemas...</p>
                  </div>
              ) : filteredProblems.length > 0 ? (
                  currentProblems.map((prob) => (
                      <Link 
                          key={prob.id}
                          href={`/problems/${prob.id}`}
                          className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#182B27]/50 transition-colors cursor-pointer group"
                      >
                          <div className="col-span-5 md:col-span-4">
                              <h3 className="font-bold text-[#EAEAEA] group-hover:text-[#6BBF99] transition-colors">
                                {prob.title}
                              </h3>
                              <div className="md:hidden flex gap-2 mt-1 text-xs text-[#8CA69E]">
                                  <span>{prob.year}</span>
                                  <span>•</span>
                                  <span>{formatLevel(prob.level)}</span>
                              </div>
                          </div>
                          
                          <div className="col-span-2 hidden md:block text-center font-mono text-sm text-[#8CA69E]">{prob.year}</div>
                          <div className="col-span-2 hidden md:block text-center text-sm text-[#EAEAEA]">
                            {formatLevel(prob.level)}
                          </div>
                          <div className="col-span-2 hidden md:block text-center text-sm text-[#EAEAEA]">Fase {prob.phase}</div>

                          <div className="col-span-7 md:col-span-2 flex justify-end">
                              {getScoreBadge(prob.id)}
                          </div>
                      </Link>
                  ))
              ) : (
                  <div className="p-12 text-center text-[#8CA69E]">
                      <Filter className="mx-auto h-12 w-12 opacity-20 mb-4" />
                      <p className="text-lg font-medium">Nenhum problema encontrado</p>
                      <p className="text-sm opacity-60">Tente ajustar seus filtros de pesquisa.</p>
                  </div>
              )}
          </div>
      </div>

      {/* --- PAGINAÇÃO --- */}
      {!loading && filteredProblems.length > 0 && (
          <div className="flex items-center justify-between px-2 pt-2">
              <p className="text-sm text-[#8CA69E]">
                  Mostrando <span className="font-bold text-[#EAEAEA]">{indexOfFirstItem + 1}</span> a <span className="font-bold text-[#EAEAEA]">{Math.min(indexOfLastItem, filteredProblems.length)}</span> de <span className="font-bold text-[#EAEAEA]">{filteredProblems.length}</span> problemas
              </p>
              
              <div className="flex items-center gap-2">
                  <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-[#2A453F] bg-[#13201E] text-[#EAEAEA] hover:bg-[#182B27] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      <ChevronLeft size={18} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                      {(() => {
                          let startPage = Math.max(1, currentPage - 2);
                          let endPage = Math.min(totalPages, startPage + 4);

                          if (endPage - startPage < 4) {
                              startPage = Math.max(1, endPage - 4);
                          }

                          const pages = [];
                          for (let i = startPage; i <= endPage; i++) {
                              pages.push(i);
                          }

                          return pages.map((pageNum) => (
                              <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                                      currentPage === pageNum
                                          ? 'bg-[#3A7D63] text-white border border-[#3A7D63]'
                                          : 'bg-[#13201E] text-[#8CA69E] border border-[#2A453F] hover:bg-[#182B27]'
                                  }`}
                              >
                                  {pageNum}
                              </button>
                          ));
                      })()}
                  </div>

                  <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-[#2A453F] bg-[#13201E] text-[#EAEAEA] hover:bg-[#182B27] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      <ChevronRight size={18} />
                  </button>
              </div>
          </div>
      )}
    </div>
  );
}