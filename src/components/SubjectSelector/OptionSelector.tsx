import React from 'react';

interface OptionSelectorProps {
  options: string[];
  selectedOption?: string;
  onChange: (option: string) => void;
}

export function OptionSelector({ options, selectedOption, onChange }: OptionSelectorProps) {
  return (
    <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange('all')}
        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
          ${selectedOption === 'all' || !selectedOption
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
          }`}
      >
        Random
      </button>

      <div className="h-8 w-px bg-gray-200" />

      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
            ${selectedOption === option
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
            }`}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
}