import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Sparkles, TrendingUp } from 'lucide-react';

interface ProductivityChartWidgetProps {
  data?: { day: string; completed: number; created: number }[];
}

export const ProductivityChartWidget: React.FC<ProductivityChartWidgetProps> = ({ data }) => {
  const chartData = data || [
    { day: 'Mon', completed: 3, created: 4 },
    { day: 'Tue', completed: 5, created: 3 },
    { day: 'Wed', completed: 6, created: 5 },
    { day: 'Thu', completed: 4, created: 2 },
    { day: 'Fri', completed: 7, created: 4 },
    { day: 'Sat', completed: 2, created: 1 },
    { day: 'Sun', completed: 3, created: 1 },
  ];

  return (
    <div className="rounded-2xl p-5 border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Weekly Velocity</h3>
            <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +28%
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Completed vs Created Tasks</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-white/20" />
            <span>Created</span>
          </div>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
            <XAxis
              dataKey="day"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              fontFamily="monospace"
            />
            <YAxis
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              fontFamily="monospace"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(21, 26, 33, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fff',
                backdropFilter: 'blur(8px)',
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#6366F1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#velocityGrad)"
            />
            <Area
              type="monotone"
              dataKey="created"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
