import React, { useState, useRef } from 'react';
import { History } from 'lucide-react';
import { useRecentActivityPaginated } from '../../hooks/useRecentActivityPaginated';
import { ActivityRow } from './ActivityRow';
import { Pagination } from '../ui/Pagination';
import { ProblemSetPerformance } from './ProblemSetPerformance';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface RecentActivityProps {
  dateRange: DateRange;
}

export function RecentActivity({ dateRange }: RecentActivityProps) {
  const { activities, isLoading, pagination } = useRecentActivityPaginated(dateRange);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    const currentScroll = contentRef.current?.offsetTop || 0;
    pagination.goToPage(page);
    window.scrollTo({ top: currentScroll, behavior: 'smooth' });
  };

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-48"></div>;
  }

  return (
        <div className="bg-white rounded-lg shadow" ref={contentRef}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          </div>
          <div className="border-t border-gray-100">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-3">
                <History className="w-8 h-8" />
                <div>No activity to show.</div>
              </div>
            ) : (
              <>
                {activities.map(activity => (
                  <ActivityRow
                    key={activity.id}
                    activity={activity}
                    isExpanded={activity.id === expandedId}
                    onToggle={() => setExpandedId(activity.id === expandedId ? null : activity.id)}
                  />
                ))}
                <div className="p-4 border-t border-gray-100">
                  <Pagination 
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    pageSize={pagination.pageSize}
                    totalCount={pagination.totalCount}
                    onPageChange={handlePageChange}
                    onPageSizeChange={pagination.onPageSizeChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
  );
}