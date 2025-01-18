import React, { useMemo } from 'react';
import { QuestionProps } from '../types/question';
import { QuestionOption } from './QuestionOption';
import { LaTeX } from './LaTeX';
import { Loader2 } from 'lucide-react';
import { shuffleOptions } from '../lib/utils/array';
import { BackgroundPattern } from './ui/BackgroundPattern';
import { AddToProblemSetButton } from './AddToProblemSetButton';
import { useAuth } from '../contexts/AuthContext';

interface ExtendedQuestionProps extends QuestionProps {
  questionId?: string;
}

export function Question({ 
  question, 
  options = [], 
  selectedAnswer, 
  onAnswerSelect, 
  onSubmit,
  isLoading,
  error,
  questionId
}: ExtendedQuestionProps) {
  const { user } = useAuth();
  const shuffledOptions = useMemo(() => shuffleOptions(options), [options]);

  const handleSubmit = () => {
    if (!selectedAnswer) {
      alert('Please select an answer before submitting.');
      return;
    }
    onSubmit();
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-8 border-b sm:border-r border-gray-200 flex items-center justify-center min-h-[50vh] md:min-h-[calc(100vh-8.5rem)]">
        <BackgroundPattern className="text-blue-600" />
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 sm:p-8 border-b sm:border-r border-gray-200 min-h-[50vh] md:min-h-[calc(100vh-8.5rem)]">
        <BackgroundPattern className="text-blue-600" />
        <div className="max-w-xl mx-auto">
          <div className="text-red-500 text-center">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="bg-white p-4 sm:p-8 border-b sm:border-r border-gray-200 min-h-[50vh] md:min-h-[calc(100vh-8.5rem)]">
        <BackgroundPattern className="text-blue-600" />
        <div className="max-w-xl mx-auto">
          <div className="text-gray-500 text-center">
            <p>No question available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-8 border-b sm:border-r border-gray-200 min-h-[50vh] md:min-h-[calc(100vh-8.5rem)] overflow-y-auto">
      <BackgroundPattern className="text-blue-600" />
      <div className="max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Question</h2>
          {user && questionId && (
            <AddToProblemSetButton questionId={questionId} />
          )}
        </div>

        <div className="text-lg text-gray-700 mb-8">
          <p className="mb-4">{question.text}</p>
          {question.latex && (
            <div className="my-4 overflow-x-auto">
              <LaTeX math={question.latex} block />
            </div>
          )}
          {question.imageUrl && (
            <img 
              src={question.imageUrl} 
              alt="Question illustration" 
              className="my-4 rounded-lg max-w-full"
            />
          )}
        </div>
        
        <div className="space-y-4 mb-8">
          {shuffledOptions.map((option, index) => (
            <QuestionOption
              key={index}
              option={option}
              index={index}
              isSelected={selectedAnswer === option.text}
              onSelect={() => onAnswerSelect(option.text)}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}