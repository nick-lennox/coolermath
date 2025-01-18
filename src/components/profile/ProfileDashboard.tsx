import React from 'react';
import { StatsOverview } from './StatsOverview';
import { SubjectBreakdown } from './SubjectBreakdown';
import { RecentActivity } from './RecentActivity';
import { ActivityHeatmap } from '../explore/ActivityHeatmap';
import { ProgressChart } from './ProgressChart';
import { TimeRangeSelector } from './TimeRangeSelector';
import { useTimeRange } from '../../hooks/useTimeRange';
import { useActivityHeatmap } from '../../hooks/useActivityHeatmap';
import { PageContainer } from '../layout/PageContainer';
import { ProblemSetPerformance } from './ProblemSetPerformance';

export function ProfileDashboard() {
  const { 
    timeRange, 
    setTimeRange, 
    getDateRange,
    getDateLabel,
    navigate,
    canNavigateForward
  } = useTimeRange();
  
  const dateRange = getDateRange();
  const { data: activityData, isLoading: isLoadingActivity } = useActivityHeatmap();

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Your Progress</h1>
        <TimeRangeSelector
          selectedRange={timeRange}
          onRangeChange={setTimeRange}
          onNavigate={navigate}
          dateLabel={getDateLabel()}
          canNavigateForward={canNavigateForward}
        />
      </div>
      
      {/* First row: Overview (1/3) and Activity Heatmap (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="lg:col-span-1">
          <StatsOverview dateRange={dateRange} />
        </div>
        <div className="lg:col-span-2">
          {!isLoadingActivity && <ActivityHeatmap data={activityData} />}
        </div>
      </div>

      {/* Second row: Subject Performance, Daily Progress, and Problem Set Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div>
          <SubjectBreakdown dateRange={dateRange} />
        </div>
        <div>
          <ProgressChart dateRange={dateRange} />
        </div>
        <div>
          <ProblemSetPerformance dateRange={dateRange} />
        </div>
      </div>

      {/* Third row: Recent Activity (full width) */}
      <div>
        <RecentActivity dateRange={dateRange} />
      </div>
    </PageContainer>
  );
}