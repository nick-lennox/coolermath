import React from 'react';
import { Trophy } from 'lucide-react';
import { ScoreState } from '../../types/score';

interface ScoreDisplayProps {
  scores: ScoreState;
}

export function ScoreDisplay({ scores }: ScoreDisplayProps) {
  const { correct, total } = scores.total;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return (
    <div className="flex items-center gap-3">
      <Trophy className="w-5 h-5 text-yellow-500" />
      <div>
        <div className="text-lg font-semibold">{correct} / {total}</div>
        <div className="text-sm text-gray-600">{percentage}% Correct</div>
      </div>
    </div>
  );
}