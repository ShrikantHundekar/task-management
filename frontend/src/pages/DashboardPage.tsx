import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useCopilotStore } from '../store/copilotStore';
import { api } from '../services/api';
import {
  KanbanSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Code2,
  Sparkles,
  ArrowRight,
  Plus,
  Bot,
  Flame,
  TrendingUp,
  Cpu,
  GitPullRequest,
  CheckSquare
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks } = useTaskStore();
  const { projects, selectedProjectId } = useProjectStore();
  const { openModal, openCopilot } = useCopilotStore();

  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchTasks(selectedProjectId || undefined);
    api.getAnalytics(selectedProjectId || undefined).then(setAnalytics).catch(() => {});
  }, [selectedProjectId]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const criticalTasks = tasks.filter((t) => t.priority === 'critical').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Chart data
  const statusData = [
    { name: 'Backlog', count: tasks.filter((t) => t.status === 'backlog').length, color: '#64748B' },
    { name: 'Todo', count: tasks.filter((t) => t.status === 'todo').length, color: '#3B82F6' },
    { name: 'In Progress', count: inProgressTasks, color: '#F59E0B' },
    { name: 'In Review', count: tasks.filter((t) => t.status === 'in_review').length, color: '#8B5CF6' },
    { name: 'Testing', count: tasks.filter((t) => t.status === 'testing').length, color: '#EC4899' },
    { name: 'Done', count: completedTasks, color: '#10B981' },
  ];

  const priorityData = [
    { name: 'Low', count: tasks.filter((t) => t.priority === 'low').length, color: '#94A3B8' },
    { name: 'Medium', count: tasks.filter((t) => t.priority === 'medium').length, color: '#3B82F6' },
    { name: 'High', count: tasks.filter((t) => t.priority === 'high').length, color: '#F97316' },
    { name: 'Critical', count: criticalTasks, color: '#EF4444' },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-indigo-950/40 border border-indigo-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Sprint 24.3 • Active
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Groq Engine Ready
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            CodeFlow AI Platform
          </h1>
          <p className="text-xs text-gray-300 mt-0.5">
            Plan, code, debug, and ship with ultra-low-latency LLaMA 3.3 agent assistance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openModal('createTask')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coding Task</span>
          </button>

          <button
            onClick={() => openCopilot()}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-medium backdrop-blur-sm transition-all"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Open Copilot</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Sprint Backlog</p>
            <h3 className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">
              {totalTasks}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3 text-indigo-500" /> 3 repos tracked
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
            <KanbanSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Completion Rate */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Sprint Velocity</p>
            <h3 className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {completionRate}%
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {completedTasks} / {totalTasks} finished
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* In Progress */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">In Active Dev</p>
            <h3 className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
              {inProgressTasks}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-amber-500" /> Under development
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900">
            <Code2 className="w-5 h-5" />
          </div>
        </div>

        {/* Critical Issues */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Critical Priority</p>
            <h3 className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
              {criticalTasks}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
              <Flame className="w-3 h-3 text-rose-500" /> Requires attention
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Sprint Pipeline Distribution</h2>
              <p className="text-xs text-gray-500">Real-time task flow across Kanban columns</p>
            </div>
            <button
              onClick={() => navigate('/kanban')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View Kanban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Pie Chart */}
        <div className="p-5 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Priority Breakdown</h2>
            <p className="text-xs text-gray-500 mb-2">Severity load of current tasks</p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
            {priorityData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-400">{item.name}:</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Coding Tasks Table */}
      <div className="rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Active Coding Tasks</h2>
            <p className="text-xs text-gray-500">Tasks assigned in the current sprint</p>
          </div>
          <button
            onClick={() => navigate('/tasks')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All ({tasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Task ID</th>
                <th className="py-2.5 px-4">Title & Scope</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Subtasks</th>
                <th className="py-2.5 px-4">Tech Stack</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {recentTasks.map((t) => {
                const completedSubtasks = t.subtasks.filter((s) => s.is_completed).length;
                return (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/tasks/${t.id}`)}
                    className="hover:bg-indigo-50/40 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {t.task_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{t.title}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-sm">
                        {t.description || 'No description provided'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          t.status === 'done'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : t.status === 'in_progress'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                            : t.status === 'in_review'
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                          t.priority === 'critical'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold'
                            : t.priority === 'high'
                            ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {completedSubtasks}/{t.subtasks.length}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-mono text-[11px] text-gray-600 dark:text-gray-400">
                        <span>{t.programming_language || 'Code'}</span>
                        {t.framework && <span className="text-gray-400">/ {t.framework}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('subtasks', { task: t });
                        }}
                        className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                        title="AI Break Subtasks"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
