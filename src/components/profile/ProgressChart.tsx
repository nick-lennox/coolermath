import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useProgressData } from '../../hooks/useProgressData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, {
                  month: 'numeric',
                  day: 'numeric'
                })}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Success Rate']}
                labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric'
                })}
              />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#3B82F6"
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