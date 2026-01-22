// src/types/user.ts
import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;

  // Informações adicionais do perfil
  organization?: string;
  bio?: string;
  
  // Estatísticas (Atualizadas pela rota /api/submit)
  rankingScore: number;      // Soma das pontuações
  problemsSolved: number;    // Quantidade de problemas com nota 100
  totalSubmissions: number;  // Total de tentativas
  
  // O Firestore retorna um objeto Timestamp, não um Date direto
  lastActive?: Timestamp;
}

// Histórico de submissões do usuário
export interface SubmissionHistory {
  id?: string;           // Útil para usar como 'key' em listas React
  problemId: string;
  score: number;
  status: string;        
  language: number;      
  submittedAt: Timestamp;
  time?: string | number;   
  memory?: number;
}