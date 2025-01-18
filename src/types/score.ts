export interface SubjectScore {
  correct: number;
  total: number;
}

export interface ScoreState {
  total: SubjectScore;
  bySubject: Record<string, SubjectScore>;
}