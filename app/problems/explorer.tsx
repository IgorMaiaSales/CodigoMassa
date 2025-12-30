'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, CheckCircle, CircleDashed } from 'lucide-react';
import Link from 'next/link';
import { ProblemSummary } from '@/types/problem';

export default function ProblemExplorer() {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('Todos');
  const [filterLevel, setFilterLevel] = useState('Todos');
  const [filterPhase, setFilterPhase] = useState('Todos');

  // --- BUSCA DE DADOS NA API ---
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (filterYear !== 'Todos') params.append('year', filterYear);
        if (filterLevel !== 'Todos') params.append('level', filterLevel);
        
        // SIMPLIFICADO: Como os valores do select já são "1", "2", "3",
        // não precisamos fazer replace/regex. Basta enviar direto.
        if (filterPhase !== 'Todos') params.append('phase', filterPhase);
        
        const res = await fetch(`/api/problems?${params.toString()}`);
        if (!res.ok) throw new Error('Falha ao buscar problemas');
        
        const data = await res.json();
        setProblems(data);
      } catch (error) {
        console.error("Erro ao buscar problemas", error);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    }; 

    fetchProblems(); 
  }, [filterYear, filterLevel, filterPhase]); 

  // --- FILTRAGEM LOCAL (Apenas Texto) ---
  const filteredProblems = problems.filter(prob => {
    const term = searchTerm.toLowerCase();
    return prob.title.toLowerCase().includes(term);
  });

  const formatLevel = (levels: string[]) => {
    const map: Record<string, string> = {
      'J': 'Júnior',
      '1': 'Nível 1',
      '2': 'Nível 2',
      'S': 'Sênior',
      'Iniciante': 'Iniciante'
    };
    
    // Se por acaso vier null ou undefined (proteção)
    if (!levels || !Array.isArray(levels)) return 'Nível desconhecido';

    // Mapeia cada código do array para o nome e junta com " / "
    // Exemplo: ["2", "S"] vira "Nível 2 / Sênior"
    return levels.map(l => map[l] || l).join(' / ');
  };

  const getScoreBadge = (score: number | null, status: string) => {
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-2 text-[#8CA69E] opacity-60">
          <CircleDashed size={18} />
          <span className="text-sm font-medium">Não tentado</span>
        </div>
      );
    }
    return null; 
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

             {/* Ano */}
             <div className="md:col-span-2 relative">
                <select 
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="block w-full pl-3 pr-8 py-2.5 bg-[#0F1A18] border border-[#2A453F] rounded-lg text-[#EAEAEA] appearance-none focus:ring-1 focus:ring-[#3A7D63] outline-none cursor-pointer"
                >
                    <option value="Todos">Ano: Todos</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8CA69E] pointer-events-none" />
            </div>

             {/* Nível */}
             <div className="md:col-span-2 relative">
                <select 
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="block w-full pl-3 pr-8 py-2.5 bg-[#0F1A18] border border-[#2A453F] rounded-lg text-[#EAEAEA] appearance-none focus:ring-1 focus:ring-[#3A7D63] outline-none cursor-pointer"
                >
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
                  <select 
                    value={filterPhase}
                    onChange={(e) => setFilterPhase(e.target.value)}
                    className="block w-full pl-3 pr-8 py-2.5 bg-[#0F1A18] border border-[#2A453F] rounded-lg text-[#EAEAEA] appearance-none focus:ring-1 focus:ring-[#3A7D63] outline-none cursor-pointer"
                >
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
                  filteredProblems.map((prob) => (
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
                              {getScoreBadge(null, 'pending')}
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
    </div>
  );
}