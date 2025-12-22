// src/types/problem.ts

export interface TestExample {
  input: string;
  output: string;
  explanation?: string; // Opcional, pois nem sempre tem
}

export interface Subtask {
  id: number;
  score: number;
  description: string; // Ex: "N <= 100"
}

export interface Problem {
  id?: string; // Gerado pelo Firebase
  slug: string; // Identificador único para URL (ex: 'torre-de-hanoi')
  title: string;
  year: number;
  level: 'Iniciante' | 'Nível 1' | 'Nível 2' | 'Sênior';
  phase: 'Fase 1' | 'Fase 2' | 'Fase 3';
  
  // Conteúdo (Geralmente em Markdown para suportar matemática/código)
  statement: string;      // Enunciado
  inputFormat: string;    // Especificação de Entrada
  outputFormat: string;   // Especificação de Saída
  constraints: string;    // Restrições gerais
  
  subtasks?: Subtask[];   // Array opcional, pois nem toda questão tem subtasks explícitas
  examples: TestExample[];
  
  createdAt: Date;
}