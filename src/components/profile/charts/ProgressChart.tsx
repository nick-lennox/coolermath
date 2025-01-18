import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useProgressData } from '../../../hooks/useProgressData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { 
  CHART_COLORS, 
  CHART_MARGINS, 
  AXIS_STYLES, 
  GRID_STYLES,
  AXIS_LINE_STYLES,
  CustomTooltip 
} from './ChartStyles';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface ProgressChartProps {
  dateRange: DateRange;
}

export function ProgressChart({ dateRange }: ProgressChartProps) {
  const { progressData, isLoading } = useProgressData(dateRange);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-48"></div>;
  }

  const hasData = progressData.some(day => day.total > 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Progress</h2>
      {!hasData ? (
        <div className="text-center py-8 text-gray-500 flex flex-col items-center gap-3">
          <TrendingUp className="w-8 h-8" />
          <div>
            No daily progress data to display.
          </div>
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={progressData}
              margin={CHART_MARGINS}
            >
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_STYLES} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, {
                  month: 'numeric',
                  day: 'numeric'
                })}
                tick={AXIS_STYLES.tick}
                tickLine={false}
                axisLine={AXIS_LINE_STYLES}
              >
                <Label 
                  value="Date" 
                  position="bottom" 
                  offset={20}
                  style={AXIS_STYLES.label}
                />
              </XAxis>
              <YAxis
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                tick={AXIS_STYLES.tick}
                tickLine={false}
                axisLine={AXIS_LINE_STYLES}
              >
                <Label 
                  value="Success Rate" 
                  angle={-90}
                  position="left"
                  offset={0}
                  style={AXIS_STYLES.label}
                />
              </YAxis>
              <Tooltip
                content={CustomTooltip}
                labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric'
                })}
              />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke={CHART_COLORS.primary}
                fill="url(#colorProgress)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}