import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Question } from '../Question';
import { Scratchpad, ScratchpadRef } from '../Scratchpad';
import { QuizProgress } from './QuizProgress';
import { QuizResults } from './QuizResults';
import { QuizState, QuizQuestion } from '../../types/quiz';
import { recordSubmission } from '../../lib/submissions';
import { useAuth } from '../../contexts/AuthContext';

interface QuizViewProps {
  questions: QuizQuestion[];
  problemSetId: string;
  onBack: () => void;
}

export function QuizView({ questions, problemSetId, onBack }: QuizViewProps) {
  const { user } = useAuth();
  const scratchpadRef = useRef<ScratchpadRef>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    isComplete: false
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const progress = (quizState.currentQuestionIndex / questions.length) * 100;

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !user) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Record the submission
    await recordSubmission({
      userId: user.id,
      selection: { testType: 'quiz', problemSetId },
      submittedAnswer: selectedAnswer,
      isCorrect,
      questionId: currentQuestion.id
    });

    // Update quiz state
    const newAnswers = {
      ...quizState.answers,
      [currentQuestion.id]: selectedAnswer
    };

    const isLastQuestion = quizState.currentQuestionIndex === questions.length - 1;

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
      isComplete: isLastQuestion
    }));

    setSelectedAnswer(null);
    scratchpadRef.current?.clear();
  };

  const handleGoBack = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
      setSelectedAnswer(quizState.answers[questions[quizState.currentQuestionIndex - 1].id] || null);
      scratchpadRef.current?.clear();
    }
  };

  if (quizState.isComplete) {
    const results = {
      totalQuestions: questions.length,
      correctAnswers: questions.reduce((count, q) => {
        return count + (quizState.answers[q.id] === q.correctAnswer ? 1 : 0);
      }, 0),
      answers: questions.reduce((acc, q) => {
        acc[q.id] = {
          submitted: quizState.answers[q.id],
          correct: q.correctAnswer,
          isCorrect: quizState.answers[q.id] === q.correctAnswer
        };
        return acc;
      }, {} as Record<string, any>)
    };

    return <QuizResults results={results} questions={questions} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Quiz
          </button>
          <QuizProgress 
            current={quizState.currentQuestionIndex + 1} 
            total={questions.length} 
            progress={progress}
          />
        </div>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <Question
              question={currentQuestion.question}
              options={currentQuestion.options}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={setSelectedAnswer}
              onSubmit={handleSubmitAnswer}
              isLoading={false}
              error={null}
            />

            {quizState.currentQuestionIndex > 0 && (
              <div className="px-8 py-4 border-t border-gray-200">
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </button>
              </div>
            )}
          </div>
          <Scratchpad ref={scratchpadRef} />
        </main>
      </div>
    </div>
  );
}