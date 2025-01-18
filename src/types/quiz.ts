export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isComplete: boolean;
}

export interface QuizQuestion {
  id: string;
  question: {
    text: string;
    latex?: string;
  };
  options: Array<{
    text: string;
    latex?: string;
  }>;
  correctAnswer: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  answers: Record<string, {
    submitted: string;
    correct: string;
    isCorrect: boolean;
  }>;
}