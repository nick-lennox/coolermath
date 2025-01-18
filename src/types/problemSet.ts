export interface ProblemSet {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  question_count: number;
}

export interface ProblemSetQuestion {
  id: string;
  problem_set_id: string;
  question_id: string;
  order: number;
  created_at: string;
}