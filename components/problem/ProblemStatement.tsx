import React from 'react';
import { ThumbsUp, Star } from 'lucide-react';
import { Problem } from '@/types/problem';

interface ProblemStatementProps {
  problem: Problem;
}

export default function ProblemStatement({ problem }: ProblemStatementProps) {
  const renderHTML = (content: string) => ({ __html: content });

  // Função para formatar o nível
  const formatLevel = (levelCode: string) => {
    const map: Record<string, string> = {
      'J': 'Júnior',
      '1': 'Nível 1',
      '2': 'Nível 2',
      'S': 'Sênior',
      'Iniciante': 'Iniciante'
    };
    return map[levelCode] || levelCode;
  };

  return (
    <div className="w-full md:w-[40%] flex flex-col border-r border-brand-border bg-brand-panel h-full">
      
      {/* --- HEADER --- */}
      <div className="p-6 border-b border-brand-border bg-brand-panel shrink-0">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-2xl font-bold text-brand-text">{problem.title}</h1>
          <div className="flex gap-2 flex-wrap justify-end">
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-brand-surface border border-brand-border text-brand-muted">
              {problem.year}
            </span>
            
            {/* Nível por Extenso */}
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-brand-green/20 text-brand-green-light border border-brand-green/50">
              {formatLevel(problem.level)}
            </span>

             <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-brand-surface border border-brand-border text-brand-muted">
              Fase {problem.phase}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-brand-muted font-medium">
          <button className="flex items-center gap-1.5 hover:text-brand-green-light transition">
            <ThumbsUp size={14} /> 2.4k
          </button>
          <button className="flex items-center gap-1.5 hover:text-brand-yellow transition">
            <Star size={14} /> Favoritar
          </button>
        </div>
      </div>

      {/* --- CONTEÚDO SCROLLÁVEL --- */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-brand-panel text-sm leading-relaxed text-brand-text space-y-8">
        
        {/* 1. Enunciado */}
        <div 
          className="prose prose-invert prose-p:text-brand-text prose-code:text-brand-green-light prose-code:bg-brand-surface prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={renderHTML(problem.statement)} 
        />

        {/* 2. Entrada */}
        <div>
           <h3 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Entrada</h3>
           <div 
             className="text-brand-muted"
             dangerouslySetInnerHTML={renderHTML(problem.input_format)} 
           />
        </div>

        {/* 3. Saída */}
        <div>
           <h3 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Saída</h3>
           <div 
             className="text-brand-muted"
             dangerouslySetInnerHTML={renderHTML(problem.output_format)} 
           />
        </div>

        {/* 4. Restrições */}
        <div>
            <h3 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Restrições</h3>
            <div 
             className="text-brand-muted"
             dangerouslySetInnerHTML={renderHTML(problem.constraints)} 
           />
        </div>

        {/* 5. Pontuação (Subtasks) */}
        {problem.subtasks && problem.subtasks.length > 0 && (
          <div>
            <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Pontuação</h3>
            <div className="border border-brand-border rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-brand-surface/50 text-xs uppercase text-brand-muted">
                  <tr>
                    <th className="p-3 border-b border-brand-border">Subtarefa</th>
                    <th className="p-3 border-b border-brand-border">Pontos</th>
                    <th className="p-3 border-b border-brand-border">Restrição</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {problem.subtasks.map((sub) => (
                    <tr key={sub.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface/50">
                      <td className="p-3 text-brand-text">{sub.id}</td>
                      <td className="p-3 text-brand-green-light font-bold">{sub.score}</td>
                      <td className="p-3 text-brand-muted">{sub.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Exemplos */}
        <div>
           <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Exemplos</h3>
           <div className="space-y-4">
             {problem.examples.map((ex, idx) => (
               <div key={idx} className="bg-brand-surface/30 border border-brand-border rounded-xl p-4 shadow-sm">
                 <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3">Exemplo {idx + 1}</h4>
                 <div className="font-mono text-sm space-y-3">
                   <div>
                     <span className="text-brand-green-light select-none block text-xs mb-1">Entrada:</span>
                     <div className="bg-brand-dark/50 p-2 rounded border border-brand-border text-gray-300 whitespace-pre-wrap">{ex.input}</div>
                   </div>
                   <div>
                     <span className="text-brand-yellow select-none block text-xs mb-1">Saída:</span>
                     <div className="bg-brand-dark/50 p-2 rounded border border-brand-border text-white font-bold whitespace-pre-wrap">{ex.output}</div>
                   </div>
                   {ex.explanation && (
                     <p className="text-xs text-brand-muted mt-2 italic opacity-70 border-t border-brand-border pt-2">
                       {ex.explanation}
                     </p>
                   )}
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}