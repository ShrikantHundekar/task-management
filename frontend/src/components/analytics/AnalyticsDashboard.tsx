import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Flame,
} from 'lucide-react';
import { AnalyticsSummary } from '../../types';

interface AnalyticsDashboardProps {
  summary: AnalyticsSummary;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ summary }) => {
  const statusPieData = [
    { name: 'Completed', value: summary.tasks_by_status.done || 2, color: '#10B981' },
    { name: 'In Progress', value: summary.tasks_by_status.in_progress || 4, color: '#3B82F6' },
    { name: 'Testing', value: summary.tasks_by_status.testing || 1, color: '#8B5CF6' },
    { name: 'In Review', value: summary.tasks_by_status.in_review || 1, color: '#F59E0B' },
    { name: 'Todo', value: summary.tasks_by_status.todo || 1, color: '#6366F1' },
    { name: 'Backlog', value: summary.tasks_by_status.backlog || 2, color: '#94A3B8' },
  ];

  const priorityData = [
    { priority: 'Critical', count: summary.tasks_by_priority.critical || 2, fill: '#F43F5E' },
    { priority: 'High', count: summary.tasks_by_priority.high || 3, fill: '#F59E0B' },
    { priority: 'Medium', count: summary.tasks_by_priority.medium || 4, fill: '#3B82F6' },
    { priority: 'Low', count: summary.tasks_by_priority.low || 1, fill: '#64748B' },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono font-semibold uppercase">
            <span>Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono">
            {summary.completion_rate}%
          </p>
          <span className="text-xs text-emerald-500 font-semibold font-mono mt-1 inline-block">
            +14% vs last sprint
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono font-semibold uppercase">
            <span>Avg Lead Time</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono">
            {summary.avg_completion_hours} hrs
          </p>
          <span className="text-xs text-blue-500 font-semibold font-mono mt-1 inline-block">
            Sub-5h cycle target
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono font-semibold uppercase">
            <span>AI Assisted Rate</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono">
            {Math.round((summary.ai_assisted_count / (summary.total_tasks || 1)) * 100)}%
          </p>
          <span className="text-xs text-indigo-500 font-semibold font-mono mt-1 inline-block">
            {summary.ai_assisted_count} tasks augmented
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono font-semibold uppercase">
            <span>Active Sprint Tasks</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono">
            {summary.in_progress_tasks + summary.pending_tasks}
          </p>
          <span className="text-xs text-amber-500 font-semibold font-mono mt-1 inline-block">
            {summary.overdue_tasks} overdue item
          </span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Velocity */}
        <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            Weekly Sprint Velocity
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono">
            Task creation vs resolution rate per day
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.weekly_completion} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(21, 26, 33, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="completed" stroke="#6366F1" strokeWidth={2.5} fill="url(#areaColor)" />
                <Area type="monotone" dataKey="created" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Distribution */}
        <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            Task Status Distribution
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono">
            Pipeline breakdown across workflow states
          </p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(21, 26, 33, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend
                  formatter={(val) => <span className="text-xs text-gray-600 dark:text-gray-300 font-mono">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: AI Hours Saved vs Manual */}
        <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            AI Productivity ROI (Hours Saved)
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono">
            Groq LLaMA-3.3-70B velocity contribution
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.ai_productivity_trend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                <XAxis dataKey="week" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(21, 26, 33, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend
                  formatter={(val) => (
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-mono">
                      {val === 'savedHours' ? 'Hours Saved by AI' : 'Manual Coding Hours'}
                    </span>
                  )}
                />
                <Bar dataKey="savedHours" fill="#6366F1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="manualHours" fill="#94A3B8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Priority Breakdown */}
        <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            Tasks by Priority Level
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono">
            Risk mitigation and urgent blocker tracking
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
                <XAxis dataKey="priority" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(21, 26, 33, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
