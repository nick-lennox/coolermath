import React from 'react';

interface DifficultyBadgeProps {
  difficulty: string;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const getColorClasses = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'basic':
        return 'bg-green-50 text-green-700';
      case 'intermediate':
        return 'bg-yellow-50 text-yellow-700';
      case 'advanced':
        return 'bg-orange-50 text-orange-700';
      case 'challenge':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className={`px-2 py-1 rounded-md text-sm font-medium ${getColorClasses(difficulty)}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </div>
  );
}