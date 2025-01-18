import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { AnswerOverlayProps } from '../types/question';
import { LaTeX } from './LaTeX';

export function AnswerOverlay({ 
  isVisible, 
  selectedAnswer, 
  correctAnswer, 
  explanation, 
  onNext 
}: AnswerOverlayProps) {
  const [showContent, setShowContent] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsCorrect(selectedAnswer === correctAnswer);
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible, selectedAnswer, correctAnswer]);

  const getAnswerLetter = (answer: string) => {
    const index = explanation.options.findIndex(opt => opt.text === answer);
    return index >= 0 ? String.fromCharCode(65 + index) : '';
  };

  return (
    <div 
      className={`fixed inset-0 bg-white transform transition-transform duration-500 ease-in-out z-[60] ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {showContent && (
        <div className="max-w-2xl mx-auto px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            {isCorrect ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
            <h2 className="text-2xl font-bold">
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h2>
          </div>

          {!isCorrect && (
            <div className="mb-8 grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="text-sm text-gray-600 mb-2">Your answer:</div>
                <div className="text-lg">
                  <span className="text-gray-500 font-medium">
                    {getAnswerLetter(selectedAnswer)}. {' '}
                  </span>
                  <span className="text-red-600 font-semibold">
                    <LaTeX math={explanation.options.find(opt => opt.text === selectedAnswer)?.latex || selectedAnswer} />
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-sm text-gray-600 mb-2">Correct answer:</div>
                <div className="text-lg">
                  <span className="text-gray-500 font-medium">
                    {getAnswerLetter(correctAnswer)}. {' '}
                  </span>
                  <span className="text-green-600 font-semibold">
                    <LaTeX math={explanation.options.find(opt => opt.text === correctAnswer)?.latex || correctAnswer} />
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-4">Explanation:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{explanation.text}</p>
            {explanation.latex && (
              <div className="mt-4 overflow-x-auto">
                <LaTeX math={explanation.options.find(opt => opt.text === correctAnswer)?.latex || correctAnswer} block />
              </div>
            )}
          </div>

          <button
            onClick={onNext}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Question
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}