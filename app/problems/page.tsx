'use client';

import React from 'react';
import Navbar from '@/components/Navbar'; // Ajuste o caminho conforme sua estrutura de pastas
import ProblemExplorer from './explorer'; // Ajuste o caminho
import Footer from '@/components/Footer';

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-[#0F1A18] text-[#EAEAEA] font-sans selection:bg-[#3A7D63] selection:text-white">
      
      {/* 1. Componente Navbar Isolado */}
      <Navbar />

      {/* 2. Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Problemas</h1>
            <p className="text-[#8CA69E]">Explore o arquivo de questões da OBI e treine suas habilidades.</p>
        </div>

        {/* 3. Componente de Lista e Filtros Isolado */}
        <ProblemExplorer />
        
      </main>

      <Footer /> 
    </div>
  );
}