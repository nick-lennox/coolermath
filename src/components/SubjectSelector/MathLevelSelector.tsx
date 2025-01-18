import React from 'react';
import { MathLevel } from '../../types/subjects';

interface MathLevelSelectorProps {
  selectedLevel?: MathLevel;
  onChange: (level: MathLevel) => void;
}

export function MathLevelSelector({ selectedLevel, onChange }: MathLevelSelectorProps) {
  return (
    <div className="flex gap-4 mt-4">
      {(['I', 'II'] as MathLevel[]).map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedLevel === level
              ? 'bg-blue-600 text-white'
              : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
          }`}
        >
          Math {level}
        </button>
      ))}
    </div>
  );
}