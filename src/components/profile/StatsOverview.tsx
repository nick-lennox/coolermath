import React from 'react';
import { Trophy, Target, Clock, BarChart2 } from 'lucide-react';
import { useStats } from '../../hooks/useStats';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface StatsOverviewProps {
  dateRange: DateRange;
}

export function StatsOverview({ dateRange }: StatsOverviewProps) {
  const { stats, isLoading } = useStats(dateRange);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-48"></div>;
  }

  const hasData = stats.totalCorrect > 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
      {!hasData ? (
        <div className="text-center py-8 text-gray-500 flex flex-col items-center gap-3">
          <BarChart2 className="w-8 h-8" />
          <div>
            No activity data available for this period.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold">{stats.totalCorrect}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold">{stats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}