// src/types/problem.ts

// Informações sobre os subtarefas de um problema
export interface SubtaskMetadata {
  id: number;
  score: number;
  description: string;
}

// Informações sobre os exemplos de um problema
export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string | null;
}

// Estrutura principal do problema
export interface Problem {
  id: string; // Slug
  title: string;
  year: number;
  level: string[];
  phase: number;
  time_limit: number;
  statement: string;
  input_format: string;
  output_format: string;
  constraints: string;
  
  subtasks: SubtaskMetadata[]; 
  examples: ProblemExample[];
}

// Casos de teste associados a um problema
export interface TestCase {
  id: string;
  input: string;
  output: string;
  subtask_id: number;
  is_hidden: boolean;
  order: number;
}

// Resumo básico do problema para listagens
export interface ProblemSummary {
  id: string;
  title: string;
  year: number;
  level: string[];
  phase: number;
}