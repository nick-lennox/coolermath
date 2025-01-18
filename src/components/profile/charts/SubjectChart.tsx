import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SubjectScore } from '../../../types/score';
import { TEST_TYPES } from '../../../types/subjects';
import { 
  CHART_COLORS, 
  CHART_MARGINS, 
  AXIS_STYLES, 
  GRID_STYLES,
  AXIS_LINE_STYLES,
  CustomTooltip 
} from './ChartStyles';

interface SubjectChartProps {
  stats: Record<string, SubjectScore>;
}

export function SubjectChart({ stats }: SubjectChartProps) {
  const data = Object.entries(TEST_TYPES)
    .map(([testType, name]) => {
      const score = stats[testType] || { correct: 0, total: 0 };
      return {
        name,
        percentage: score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0,
        correct: score.correct,
        total: score.total
      };
    })
    .filter(item => item.total > 0);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={CHART_MARGINS}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={1} />
              <stop offset="100%" stopColor={CHART_COLORS.primaryLight} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_STYLES} />
          <XAxis 
            dataKey="name"
            tick={AXIS_STYLES.tick}
            tickLine={false}
            axisLine={AXIS_LINE_STYLES}
            interval={0}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            tick={AXIS_STYLES.tick}
            tickLine={false}
            axisLine={AXIS_LINE_STYLES}
          />
          <Tooltip 
            content={CustomTooltip}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar 
            dataKey="percentage"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}