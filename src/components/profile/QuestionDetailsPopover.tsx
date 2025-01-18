import React, { useRef } from 'react';
import { Eye } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { LaTeX } from '../LaTeX';

interface QuestionDetailsPopoverProps {
  question: {
    text: string;
    latex?: string;
  };
  submittedAnswer: string;
  correctAnswer: string;
  explanation: {
    text: string;
    latex?: string;
  };
}

export function QuestionDetailsPopover({
  question,
  submittedAnswer,
  correctAnswer,
  explanation
}: QuestionDetailsPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(popoverRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
        aria-label="View question details"
      >
        <Eye className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Question</h3>
              <p className="text-gray-700">{question.text}</p>
              {question.latex && (
                <div className="mt-2">
                  <LaTeX math={question.latex} block />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Your Answer</h4>
                <p className={`font-medium ${
                  submittedAnswer === correctAnswer ? 'text-green-600' : 'text-red-600'
                }`}>
                  {submittedAnswer}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Correct Answer</h4>
                <p className="font-medium text-green-600">{correctAnswer}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Explanation</h3>
              <p className="text-gray-700">{explanation.text}</p>
              {explanation.latex && (
                <div className="mt-2">
                  <LaTeX math={explanation.latex} block />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}