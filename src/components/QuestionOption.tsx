import React from 'react';
import { LaTeX } from './LaTeX';

interface QuestionOptionProps {
  option: {
    text: string;
    latex?: string;
  };
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function QuestionOption({ option, index, isSelected, onSelect }: QuestionOptionProps) {
  const letter = String.fromCharCode(65 + index); // Convert 0-3 to A-D

  return (
    <label
      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={onSelect}
    >
      <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center
        ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}
      >
        {isSelected && (
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-500 font-medium">{letter}.</span>
        {option.latex ? (
          <LaTeX math={option.latex} />
        ) : (
          <span className="text-lg text-gray-700">{option.text}</span>
        )}
      </div>
    </label>
  );
}