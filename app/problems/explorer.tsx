'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronDown, CheckCircle, XCircle, AlertCircle, CircleDashed } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_PROBLEMS = [
  { id: 1, name: 'Idade de Camila', year: 2021, level: 'Nível 1', phase: 'Fase 1', status: 'pending', score: null },
  { id: 2, name: 'Bondinho', year: 2017, level: 'Nível 1', phase: 'Fase 2', status: 'submitted', score: 100 },
  { id: 3, name: 'Mapa', year: 2017, level: 'Nível 2', phase: 'Fase 2', status: 'submitted', score: 40 },
  { id: 4, name: 'Botas Trocadas', year: 2017, level: 'Nível 1', phase: 'Fase 1', status: 'submitted', score: 0 },
  { id: 5, name: 'Quadrado Mágico', year: 2020, level: 'Nível 2', phase: 'Fase 1', status: 'pending', score: null },
  { id: 6, name: 'Torre de Hanói', year: 2018, level: 'Nível 2', phase: 'Fase 3', status: 'submitted', score: 100 },
  { id: 7, name: 'Fissura Perigosa', year: 2020, level: 'Sênior', phase: 'Fase 2', status: 'submitted', score: 85 },
];

export default function ProblemExplorer() {
  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('Todos');
  const [filterLevel, setFilterLevel] = useState('Todos');
  const [filterPhase, setFilterPhase] = useState('Todos');

  // Lógica de Filtragem
  const filteredProblems = MOCK_PROBLEMS.filter(prob => {
    const matchesSearch = prob.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === 'Todos' || prob.year.toString() === filterYear;
    const matchesLevel = filterLevel === 'Todos' || prob.level === filterLevel;
    const matchesPhase = filterPhase === 'Todos' || prob.phase === filterPhase;
    return matchesSearch && matchesYear && matchesLevel && matchesPhase;
  });

  // Helper de UI para o Score
  const getScoreBadge = (score: number | null, status: string) => {
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-2 text-[#8CA69E] opacity-60">
          <CircleDashed size={18} />
          <span className="text-sm font-medium">Não tentado</span>
        </div>
      );
    }

    let colorClass = '';
    let icon = null;

    if (score === 100) {
      colorClass = 'bg-[#3A7D63]/20 text-[#6BBF99] border-[#3A7D63]/50'; 
      icon = <CheckCircle size={16} />;
    } else if (score === 0) {
      colorClass = 'bg-[#CF5C5C]/20 text-[#CF5C5C] border-[#CF5C5C]/50';
      icon = <XCircle size={16} />;
    } else {
      colorClass = 'bg-[#D4B04C]/20 text-[#D4B04C] border-[#D4B04C]/50';
      icon = <AlertCircle size={16} />;
    }

    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${colorClass} w-fit`}>
        {icon}
        <span className="text-sm font-bold font-mono">{score} / 100</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      
      {/* --- BARRA DE FILTROS --- */}
      <div className="bg-[#13201E] border border-[#2A453F] rounded-xl p-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Busca por Nome */}
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

            {/* Filtro: Ano */}
            <div className="md:col-span-2 relative">
                <select 
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="block w-full pl-3 pr-8 py-2.5 bg-[#0F1A18] border border-[#2A453F] rounded-lg text-[#EAEAEA] appearance-none focus:ring-1 focus:ring-[#3A7D63] outline-none cursor-pointer"
                >
                    <option value="Todos">Ano: Todos</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8CA69E] pointer-events-none" />
            </div>

            {/* Filtro: Nível */}
            <div className="md:col-span-2 relative">
                <select 
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="block w-full pl-3 pr-8 py-2.5 bg-[#0F1A18] border border-[#2A453F] rounded-lg text-[#EAEAEA] appearance-none focus:ring-1 focus:ring-[#3A7D63] outline-none cursor-pointer"
                >
                    <option value="Todos">Nível: Todos</option>
                    <option value="Nível 1">Nível 1</option>
                    <option value="Nível 2">Nível 2</option>
                    <option value="Sênior">Sênior</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8CA69E] pointer-events-none" />
            </div>

            {/* Filtro: Fase */}
            <div className="md:col-span-3 relative">
                  <select 
                    value={filterPhase}
                    onChange={(e) => setFilterPhase(e.target.value)}
                    className="block w-full pl-3 pr-8 py-2.5 bg-[#0F1A18] border border-[#2A453F] rounded-lg text-[#EAEAEA] appearance-none focus:ring-1 focus:ring-[#3A7D63] outline-none cursor-pointer"
                >
                    <option value="Todos">Fase: Todas</option>
                    <option value="Fase 1">Fase 1</option>
                    <option value="Fase 2">Fase 2</option>
                    <option value="Fase 3">Fase 3</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#8CA69E] pointer-events-none" />
            </div>

        </div>
      </div>

      {/* --- LISTA DE PROBLEMAS --- */}
      <div className="bg-[#13201E] border border-[#2A453F] rounded-xl overflow-hidden shadow-lg">
          
          {/* Header da Tabela */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#2A453F] bg-[#182B27] text-xs font-bold text-[#8CA69E] uppercase tracking-wider">
              <div className="col-span-5 md:col-span-4">Problema</div>
              <div className="col-span-2 hidden md:block text-center">Ano</div>
              <div className="col-span-2 hidden md:block text-center">Nível</div>
              <div className="col-span-2 hidden md:block text-center">Fase</div>
              <div className="col-span-7 md:col-span-2 text-right">Status</div>
          </div>

          {/* Linhas */}
          <div className="divide-y divide-[#2A453F]">
              {filteredProblems.length > 0 ? (
                  filteredProblems.map((prob) => (
                      <div 
                          key={prob.id} 
                          className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#182B27]/50 transition-colors cursor-pointer group"
                      >
                          {/* Nome */}
                          <div className="col-span-5 md:col-span-4">
                              <h3 className="font-bold text-[#EAEAEA] group-hover:text-[#6BBF99] transition-colors">{prob.name}</h3>
                              <div className="md:hidden flex gap-2 mt-1 text-xs text-[#8CA69E]">
                                  <span>{prob.year}</span>
                                  <span>•</span>
                                  <span>{prob.level}</span>
                              </div>
                          </div>
                          
                          {/* Metadados (Desktop) */}
                          <div className="col-span-2 hidden md:block text-center font-mono text-sm text-[#8CA69E]">{prob.year}</div>
                          <div className="col-span-2 hidden md:block text-center text-sm text-[#EAEAEA]">{prob.level}</div>
                          <div className="col-span-2 hidden md:block text-center text-sm text-[#EAEAEA]">{prob.phase}</div>

                          {/* Status */}
                          <div className="col-span-7 md:col-span-2 flex justify-end">
                              {getScoreBadge(prob.score, prob.status)}
                          </div>
                      </div>
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