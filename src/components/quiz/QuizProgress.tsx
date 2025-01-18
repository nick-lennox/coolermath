import React from 'react';

interface QuizProgressProps {
  current: number;
  total: number;
  progress: number;
}

export function QuizProgress({ current, total, progress }: QuizProgressProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="text-sm font-medium text-gray-600">
        Question {current} of {total}
      </div>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}