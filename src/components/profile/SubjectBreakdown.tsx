import React from 'react';
import { BookOpen } from 'lucide-react';
import { useSubjectStats } from '../../hooks/useSubjectStats';
import { SubjectChart } from './charts/SubjectChart';
import { hasAnyData } from '../../lib/stats/calculateStats';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface SubjectBreakdownProps {
  dateRange: DateRange;
}

export function SubjectBreakdown({ dateRange }: SubjectBreakdownProps) {
  const { subjectStats, isLoading } = useSubjectStats(dateRange);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-48"></div>;
  }

  const hasStats = hasAnyData(subjectStats);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h2>
        {!hasStats ? (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              No subject performance data to display.
            </div>
          </div>
        ) : (
          <div className="-mx-6">
            <SubjectChart stats={subjectStats} />
          </div>
        )}
      </div>
    </div>
  );
}