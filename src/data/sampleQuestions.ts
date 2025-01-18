import { Question } from '../types/question';

export const sampleQuestion: Question = {
  question: {
    text: "Solve for x:",
    latex: "3x + 7 = 22"
  },
  options: [
    { text: "3", latex: "x = 3" },
    { text: "5", latex: "x = 5" },
    { text: "7", latex: "x = 7" },
    { text: "15", latex: "x = 15" }
  ],
  explanation: {
    text: "To solve for x, first subtract 7 from both sides, then divide by 3:",
    latex: "\\begin{align*} 3x + 7 &= 22 \\\\ 3x &= 15 \\\\ x &= 5 \\end{align*}"
  },
  correctAnswer: "5"
};