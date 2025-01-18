import { useState } from 'react';
import { TimeRange } from '../components/profile/TimeRangeSelector';

export function useTimeRange() {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [offset, setOffset] = useState(0);

  const getDateRange = () => {
    const now = new Date();
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'daily':
        startDate.setDate(now.getDate() - offset);
        endDate.setDate(now.getDate() - offset + 1);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - (7 * offset) - 6);
        endDate.setDate(now.getDate() - (7 * offset) + 1);
        break;
      case 'monthly':
        startDate.setDate(now.getDate() - (30 * offset) - 29);
        endDate.setDate(now.getDate() - (30 * offset) + 1);
        break;
    }

    // Set times to start and end of day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return { startDate, endDate };
  };

  const getDateLabel = () => {
    const { startDate, endDate } = getDateRange();
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: startDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
    };

    // For daily view, only show the start date
    if (timeRange === 'daily') {
      return formatDate(startDate);
    }

    // For weekly and monthly views, show the range
    return `${formatDate(startDate)} - ${formatDate(new Date(endDate.getTime() - 1))}`;
  };

  const navigate = (direction: 'prev' | 'next') => {
    setOffset(prev => direction === 'prev' ? prev + 1 : prev - 1);
  };

  const handleRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
    setOffset(0); // Reset offset when changing range type
  };

  // Check if we can navigate forward (shouldn't go beyond current date)
  const canNavigateForward = offset > 0;

  return {
    timeRange,
    setTimeRange: handleRangeChange,
    getDateRange,
    getDateLabel,
    navigate,
    canNavigateForward
  };
}