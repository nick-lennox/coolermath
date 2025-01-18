import React, { useState, useEffect } from 'react';
import { Minimize2 } from 'lucide-react';
import { ScoreDisplay } from './ScoreDisplay';
import { SubjectScoreList } from './SubjectScoreList';
import { MinimizedView } from './MinimizedView';
import { SessionTimer } from './SessionTimer';
import { ScoreState } from '../../types/score';

interface ScoreTrackerProps {
  scores: ScoreState;
}

export function ScoreTracker({ scores }: ScoreTrackerProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Set minimized by default on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    setIsMinimized(isMobile);
  }, []);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <MinimizedView scores={scores} onExpand={() => setIsMinimized(false)} />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white rounded-lg p-4 shadow-lg w-72">
        <div className="flex items-center justify-between mb-4">
          <ScoreDisplay scores={scores} />
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Minimize score tracker"
            >
              <Minimize2 className="w-5 h-5 text-gray-400" />
            </button>
            <SessionTimer />
          </div>
        </div>

        <SubjectScoreList scores={scores} />
        
        <div className="mt-2 text-xs text-gray-500 italic">
          * Scores are for the current session
        </div>
      </div>
    </div>
  );
}