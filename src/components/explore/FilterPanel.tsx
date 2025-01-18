import React from 'react';
import { X } from 'lucide-react';
import { TEST_TYPES } from '../../types/subjects';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    subject: string;
    difficulty: string;
    successRate: string;
  };
  onFiltersChange: (filters: {
    subject: string;
    difficulty: string;
    successRate: string;
  }) => void;
}

export function FilterPanel({ isOpen, onClose, filters, onFiltersChange }: FilterPanelProps) {
  if (!isOpen) return null;

  const updateFilter = (key: keyof typeof filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: filters[key] === value ? '' : value
    });
  };

  const difficulties = [
    { value: 'Easy', color: 'bg-green-50 text-green-700 border-green-200' },
    { value: 'Medium', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { value: 'Hard', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { value: 'Challenge', color: 'bg-red-50 text-red-700 border-red-200' }
  ];

  const successRates = [
    { value: 'Above 75%', color: 'bg-green-50 text-green-700 border-green-200' },
    { value: '50% - 75%', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { value: 'Below 50%', color: 'bg-red-50 text-red-700 border-red-200' }
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity">
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Subject</h3>
            <div className="space-y-2">
              {Object.entries(TEST_TYPES).map(([type, name]) => (
                <button
                  key={type}
                  onClick={() => updateFilter('subject', type)}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    filters.subject === type
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Difficulty</h3>
            <div className="space-y-2">
              {difficulties.map(({ value, color }) => (
                <button
                  key={value}
                  onClick={() => updateFilter('difficulty', value)}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-colors border ${
                    filters.difficulty === value
                      ? color
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Success Rate</h3>
            <div className="space-y-2">
              {successRates.map(({ value, color }) => (
                <button
                  key={value}
                  onClick={() => updateFilter('successRate', value)}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-colors border ${
                    filters.successRate === value
                      ? color
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}