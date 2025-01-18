import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export type TimeRange = 'daily' | 'weekly' | 'monthly';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  dateLabel: string;
  canNavigateForward: boolean;
}

export function TimeRangeSelector({ 
  selectedRange, 
  onRangeChange,
  onNavigate,
  dateLabel,
  canNavigateForward
}: TimeRangeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                selectedRange === range
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('prev')}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Previous period"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <span className="text-sm font-medium text-gray-900 min-w-[150px] text-center">
          {dateLabel}
        </span>
        
        <button
          onClick={() => onNavigate('next')}
          disabled={!canNavigateForward}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next period"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}