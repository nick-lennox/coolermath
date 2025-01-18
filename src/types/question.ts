export interface Question {
  question: {
    text: string;
    latex?: string;
    imageUrl?: string;
  };
  options: {
    text: string;
    latex?: string;
  }[];
  explanation: {
    text: string;
    latex?: string;
    options: {
      text: string;
      latex?: string;
    }[];
  };
  correctAnswer: string;
}

export interface QuestionProps {
  question?: Question['question'];
  options: Question['options'];
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onSubmit: () => void;
}