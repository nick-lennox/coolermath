import React from 'react';
import { LaTeX } from '../LaTeX';
import { SlideOverlay } from '../ui/SlideOverlay';
import { SubjectBadge } from './badges/SubjectBadge';
import { DifficultyBadge } from './badges/DifficultyBadge';

interface ActivityDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  activity: {
    test_type: string;
    topic?: string;
    submitted_answer: string;
    is_correct: boolean;
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
}

export function ActivityDetails({ isOpen, onClose, activity }: ActivityDetailsProps) {
  if (!activity.question) return null;

  return (
    <SlideOverlay 
      isOpen={isOpen} 
      onClose={onClose}
      title="Question Details"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <SubjectBadge testType={activity.test_type} topic={activity.topic} />
          <DifficultyBadge difficulty={activity.question.difficulty} />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Question</h3>
          <p className="text-gray-700">{activity.question.text}</p>
          {activity.question.latex && (
            <div className="mt-2 overflow-x-auto">
              <LaTeX math={activity.question.latex} block />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Your Answer</h4>
            <div className={`font-medium ${
              activity.is_correct ? 'text-green-600' : 'text-red-600'
            }`}>
              <LaTeX math={activity.submitted_answer} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Correct Answer</h4>
            <div className="font-medium text-green-600">
              <LaTeX math={activity.question.correct_answer} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Explanation</h3>
          <p className="text-gray-700">{activity.question.explanation.text}</p>
          {activity.question.explanation.latex && (
            <div className="mt-2 overflow-x-auto">
              <LaTeX math={activity.question.explanation.latex} block />
            </div>
          )}
        </div>
      </div>
    </SlideOverlay>
  );
}