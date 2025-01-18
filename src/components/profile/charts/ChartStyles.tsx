import { CategoricalChartProps } from 'recharts';

export const CHART_COLORS = {
  primary: '#3B82F6', // Blue-500
  primaryLight: '#60A5FA', // Blue-400
  grid: '#E5E7EB', // Gray-200
  text: '#4B5563', // Gray-600
  textDark: '#374151', // Gray-700
};

export const CHART_MARGINS: CategoricalChartProps['margin'] = {
  top: 20,
  right: 30,
  left: 20,
  bottom: 40,
};

export const AXIS_STYLES = {
  tick: {
    fill: CHART_COLORS.text,
    fontSize: 12,
  },
  label: {
    fill: CHART_COLORS.textDark,
    fontSize: 14,
    fontWeight: 500,
  },
};

export const GRID_STYLES = {
  strokeDasharray: '3 3',
  vertical: false,
  stroke: CHART_COLORS.grid,
  strokeOpacity: 1,
};

export const AXIS_LINE_STYLES = {
  stroke: CHART_COLORS.grid,
  strokeOpacity: 1,
};

export const CustomTooltip = ({ active, payload, label, valueLabel = 'Success Rate' }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-blue-600 font-medium">
        {payload[0].value}% {valueLabel}
      </p>
      {payload[0].payload.correct !== undefined && (
        <p className="text-sm text-gray-500">
          {payload[0].payload.correct}/{payload[0].payload.total} Correct
        </p>
      )}
    </div>
  );
};