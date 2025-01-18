import React from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SubjectBadge } from './badges/SubjectBadge';
import { DifficultyBadge } from './badges/DifficultyBadge';
import { LaTeX } from '../LaTeX';

interface ActivityRowProps {
  activity: {
    id: string;
    test_type: string;
    topic?: string;
    submitted_answer: string;
    is_correct: boolean;
    created_at: string;
    problem_set?: {
      title: string;
    };
    question: {
      text: string;
      latex?: string;
      difficulty: string;
      correct_answer: string;
      explanation: {
        text: string;
        latex?: string;
      };
    } | null;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

export function ActivityRow({ activity, isExpanded, onToggle }: ActivityRowProps) {
  if (!activity.question) return null;

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {activity.is_correct ? (
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <SubjectBadge 
                testType={activity.test_type} 
                topic={activity.topic}
                problemSet={activity.problem_set}
              />
              <DifficultyBadge difficulty={activity.question.difficulty} />
              <span className="text-sm text-gray-500">
                {new Date(activity.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Question</h3>
                <p className="text-gray-700">{activity.question.text}</p>
                {activity.question.latex && (
                  <div className="mt-2 overflow-x-auto">
                    <LaTeX math={activity.question.latex} block />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Explanation</h3>
                <p className="text-gray-700">{activity.question.explanation.text}</p>
                {activity.question.explanation.latex && (
                  <div className="mt-2 overflow-x-auto">
                    <LaTeX math={activity.question.explanation.latex} block />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Your Answer</h4>
                <div className={`p-3 rounded-lg ${
                  activity.is_correct ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className={`font-medium ${
                    activity.is_correct ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <LaTeX math={activity.submitted_answer} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Correct Answer</h4>
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-medium text-green-700">
                    <LaTeX math={activity.question.correct_answer} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}