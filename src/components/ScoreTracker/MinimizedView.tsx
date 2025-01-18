import React from 'react';
import { Trophy, Maximize2 } from 'lucide-react';
import { ScoreState } from '../../types/score';
import { SessionTimer } from './SessionTimer';

interface MinimizedViewProps {
  scores: ScoreState;
  onExpand: () => void;
}

export function MinimizedView({ scores, onExpand }: MinimizedViewProps) {
  return (
    <button
      onClick={onExpand}
      className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <span className="font-semibold">{scores.total.correct}</span>
      </div>
      <div className="h-4 w-px bg-gray-200" />
      <SessionTimer />
      <Maximize2 className="w-4 h-4 text-gray-400" />
    </button>
  );
}