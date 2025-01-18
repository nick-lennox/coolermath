export interface ExploreQuestion {
  id: string;
  title: string;
  subject: string;
  level?: string;
  difficulty: string;
  attempts: number;
  successRate: number;
}