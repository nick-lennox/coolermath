import React from 'react';
import { CheckCircle, Trash2, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { removeQuestionFromProblemSet } from '../../lib/problemSets/removeQuestion';
import { LaTeX } from '../LaTeX';
import { QuizQuestion } from '../../types/quiz';

interface QuestionListProps {
  questions: QuizQuestion[];
  onQuestionSelect: (id: string) => void;
  problemSetId: string;
  createdBy: string;
  onQuestionRemoved: () => void;
  onNavigateToExplore: () => void;
}

export function QuestionList({ 
  questions, 
  onQuestionSelect, 
  problemSetId,
  createdBy,
  onQuestionRemoved,
  onNavigateToExplore
}: QuestionListProps) {
  const { user } = useAuth();
  const isOwner = user?.profile?.username === createdBy;

  const handleRemoveQuestion = async (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await removeQuestionFromProblemSet(problemSetId, questionId);
      onQuestionRemoved();
    } catch (error) {
      console.error('Error removing question:', error);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Questions Added Yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start building your problem set by adding questions from the explore page.
        </p>
        <button
          onClick={onNavigateToExplore}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Explore
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-medium">
              {index + 1}
            </div>
            <div 
              className="flex-1 cursor-pointer" 
              onClick={() => onQuestionSelect(question.id)}
            >
              <p className="text-gray-900 font-medium mb-2">{question.question.text}</p>
              {question.question.latex && (
                <div className="text-gray-600 text-sm font-mono bg-gray-50 p-2 rounded">
                  <LaTeX math={question.question.latex} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {question.attempted && question.correct && (
                <div className="flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
              {isOwner && (
                <button
                  onClick={(e) => handleRemoveQuestion(question.id, e)}
                  className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-300"
                  aria-label="Remove question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}