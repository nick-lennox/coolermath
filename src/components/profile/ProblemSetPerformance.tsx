import React from 'react';
import { Book, TrendingUp } from 'lucide-react';
import { useProblemSetStats } from '../../hooks/useProblemSetStats';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface ProblemSetPerformanceProps {
  dateRange: DateRange;
}

export function ProblemSetPerformance({ dateRange }: ProblemSetPerformanceProps) {
  const { stats, isLoading } = useProblemSetStats(dateRange);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-48"></div>;
  }

  if (stats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Problem Set Performance</h2>
        <div className="text-center py-8 text-gray-500 flex flex-col items-center gap-3">
          <Book className="w-8 h-8" />
          <div>No problem set activity yet</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Problem Set Performance</h2>
      <div className="space-y-4">
        {stats.map(set => {
          const percentage = Math.round((set.correct / set.total) * 100);
          return (
            <div key={set.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-900 font-medium line-clamp-1">{set.title}</span>
                <span className="text-gray-600">
                  {set.correct}/{set.total} ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}