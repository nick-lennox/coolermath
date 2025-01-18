import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Tooltip } from '../ui/Tooltip';

interface ActivityData {
  date: string;
  count: number;
  correct: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
}

function getColorForCount(count: number, correct: number): string {
  if (count === 0) return 'bg-gray-100';
  const successRate = (correct / count) * 100;
  
  if (successRate >= 80) return 'bg-green-500';
  if (successRate >= 60) return 'bg-green-400';
  if (successRate >= 40) return 'bg-green-300';
  return 'bg-green-200';
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const weeks = React.useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Create a map of all dates and their activity
    const activityMap = new Map(
      data.map(d => [d.date, { count: d.count, correct: d.correct }])
    );

    // Generate all dates for the past year
    const allDates = [];
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const activity = activityMap.get(dateStr) || { count: 0, correct: 0 };
      allDates.push({
        date: dateStr,
        count: activity.count,
        correct: activity.correct
      });
    }

    // Group dates into weeks
    const weeks = [];
    let currentWeek = [];
    
    for (let i = 0; i < allDates.length; i++) {
      currentWeek.push(allDates[i]);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [data]);

  // Generate month labels
  const monthLabels = React.useMemo(() => {
    const labels = [];
    let currentMonth = '';
    let currentWeekCount = 0;
    
    weeks.forEach((week) => {
      const monthName = MONTHS[new Date(week[0].date).getMonth()];
      if (monthName !== currentMonth) {
        labels.push({
          month: monthName,
          offset: currentWeekCount * 12 // 10px square + 2px gap
        });
        currentMonth = monthName;
      }
      currentWeekCount++;
    });
    
    return labels;
  }, [weeks]);

  return (
    <div className="bg-white rounded-lg h-full shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Less</span>
          <div className="flex gap-1">
            <div className="w-[10px] h-[10px] rounded-sm bg-gray-100" />
            <div className="w-[10px] h-[10px] rounded-sm bg-green-200" />
            <div className="w-[10px] h-[10px] rounded-sm bg-green-300" />
            <div className="w-[10px] h-[10px] rounded-sm bg-green-400" />
            <div className="w-[10px] h-[10px] rounded-sm bg-green-500" />
          </div>
          <span className="text-xs text-gray-600">More</span>
        </div>
      </div>
      
      <div className="relative max-w-fit">
        {/* Month labels */}
        <div className="flex mb-6">
          <div className="w-8" /> {/* Spacing for day labels */}
          <div className="flex-1 relative h-4">
            {monthLabels.map(({ month, offset }, index) => (
              <div
                key={`${month}-${index}`}
                className="absolute text-xs text-gray-500"
                style={{
                  left: `${offset}px`,
                  top: 0
                }}
              >
                {month}
              </div>
            ))}
          </div>
        </div>

        {/* Main grid with day labels */}
        <div className="flex gap-2">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] pr-2">
            {DAYS.map((day, index) => (
              <div key={day} className="h-[10px] text-xs text-gray-500 leading-[10px]">
                {index % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>

          {/* Activity grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.map((day) => (
                  <Tooltip
                    key={day.date}
                    content={
                      day.count > 0
                        ? `${day.correct} correct out of ${day.count} questions on ${formatDate(day.date)}`
                        : `No activity on ${formatDate(day.date)}`
                    }
                  >
                    <div
                      className={`w-[10px] h-[10px] rounded-sm ${getColorForCount(day.count, day.correct)}`}
                    />
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}