'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProblemStatement from '@/components/problem/ProblemStatement';
import CodeEditor from '@/components/problem/CodeEditor';
import { Problem } from '@/types/problem';
import { CircleDashed, AlertCircle } from 'lucide-react';

export default function ProblemPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`/api/problems/${slug}`);
        if (!res.ok) {
          throw new Error('Erro ao carregar problema');
        }
        const data = await res.json();
        setProblem(data);
      } catch (err) {
        setError('Problema não encontrado ou erro de servidor.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProblem();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark text-brand-text flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-brand-muted">
             <CircleDashed className="w-10 h-10 animate-spin text-brand-green" />
             <p>Carregando ambiente...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-brand-dark text-brand-text flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
           <div className="flex flex-col items-center gap-4 text-brand-error">
             <AlertCircle className="w-10 h-10" />
             <p>{error || 'Problema não encontrado'}</p>
             <a href="/problems" className="text-brand-green-light underline hover:text-white mt-2">Voltar para a lista</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-brand-dark text-brand-text font-sans flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <ProblemStatement problem={problem} />
        
        {/* PASSAGEM DO PROP OBRIGATÓRIA AQUI: */}
        <CodeEditor problemSlug={slug} />
        
      </div>
    </div>
  );
}