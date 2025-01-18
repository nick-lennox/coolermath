import React from 'react';
import { X } from 'lucide-react';

interface FilterBadgesProps {
  filters: {
    subject: string;
    difficulty: string;
    successRate: string;
  };
  onRemoveFilter: (key: keyof typeof filters) => void;
}

export function FilterBadges({ filters, onRemoveFilter }: FilterBadgesProps) {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value);

  if (activeFilters.length === 0) return null;

  const getColorClasses = (key: string, value: string) => {
    if (key === 'difficulty') {
      switch (value) {
        case 'Easy': return 'bg-green-50 text-green-700 border-green-200';
        case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'Hard': return 'bg-orange-50 text-orange-700 border-orange-200';
        case 'Challenge': return 'bg-red-50 text-red-700 border-red-200';
      }
    }
    if (key === 'successRate') {
      if (value.includes('Above')) return 'bg-green-50 text-green-700 border-green-200';
      if (value.includes('50% - 75%')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      return 'bg-red-50 text-red-700 border-red-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeFilters.map(([key, value]) => (
        <div
          key={key}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border ${getColorClasses(key, value)}`}
        >
          <span>{value}</span>
          <button
            onClick={() => onRemoveFilter(key as keyof typeof filters)}
            className="p-0.5 hover:bg-white/50 rounded-full transition-colors"
            aria-label={`Remove ${value} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}