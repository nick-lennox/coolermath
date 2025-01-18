import React from 'react';
import { Trophy, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { QuizResult, QuizQuestion } from '../../types/quiz';
import { LaTeX } from '../LaTeX';

interface QuizResultsProps {
  results: QuizResult;
  questions: QuizQuestion[];
  onBack: () => void;
}

export function QuizResults({ results, questions, onBack }: QuizResultsProps) {
  const percentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);

  return (
    <div className="w-full max-w-7xl mx-4 sm:mx-8 lg:mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Problem Set
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-center gap-4">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">{percentage}%</h2>
            <p className="text-gray-600">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const answer = results.answers[question.id];
          const isCorrect = answer.isCorrect;

          return (
            <div 
              key={question.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-500">
                      Question {index + 1}
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-900 mb-2">{question.question.text}</p>
                    {question.question.latex && (
                      <div className="mt-2 overflow-x-auto">
                        <LaTeX math={question.question.latex} block />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Your Answer</h4>
                      <div className={`p-4 rounded-lg ${
                        isCorrect ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <div className={`font-medium ${
                          isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>
                          <LaTeX math={answer.submitted} />
                        </div>
                      </div>
                    </div>

                    {!isCorrect && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-500">Correct Answer</h4>
                        <div className="p-4 rounded-lg bg-green-50">
                          <div className="font-medium text-green-700">
                            <LaTeX math={answer.correct} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {question.explanation && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Explanation</h4>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700">{question.explanation.text}</p>
                        {question.explanation.latex && (
                          <div className="mt-2 overflow-x-auto">
                            <LaTeX math={question.explanation.latex} block />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}