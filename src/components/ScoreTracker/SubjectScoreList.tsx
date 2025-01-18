import React from 'react';
import { ScoreState } from '../../types/score';
import { TEST_TYPES, TestType } from '../../types/subjects';

interface SubjectScoreListProps {
  scores: ScoreState;
}

export function SubjectScoreList({ scores }: SubjectScoreListProps) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="space-y-2">
        {Object.entries(TEST_TYPES).map(([testType, name]) => {
          const score = scores.bySubject[testType as TestType] || { correct: 0, total: 0 };
          if (score.total === 0) return null;
          
          const percentage = Math.round((score.correct / score.total) * 100);
          
          return (
            <div key={testType} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{name}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">
                  {score.correct}/{score.total}
                </span>
                <span className="text-gray-500 text-xs">
                  ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}