// src/types/problem.ts

export interface SubtaskMetadata {
  id: number;
  score: number;
  description: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string | null;
}

export interface Problem {
  id: string; // Slug
  title: string;
  year: number;
  level: string;
  phase: number;
  time_limit: number;
  statement: string;
  input_format: string;
  output_format: string;
  constraints: string;
  
  subtasks: SubtaskMetadata[]; 
  examples: ProblemExample[];
}

export interface TestCase {
  id: string;
  input: string;
  output: string;
  subtask_id: number;
  is_hidden: boolean;
  order: number; // <--- NOVO CAMPO
}