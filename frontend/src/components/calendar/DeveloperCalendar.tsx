import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { useTaskStore } from '../../store/taskStore';
import { useAppStore } from '../../store/useAppStore';

interface DeveloperCalendarProps {
  tasks: Task[];
}

export const DeveloperCalendar: React.FC<DeveloperCalendarProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 23)); // Sep 2026
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const { openTaskDrawer } = useTaskStore();
  const { openCreateTaskModal } = useAppStore();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 8, 23));
  };

  // Generate calendar grid cells
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(d);
  }

  // Filter tasks for a particular day
  const getTasksForDay = (day: number) => {
    return tasks.filter((t) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  return (
    <div className="rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#11151A] p-5 sm:p-6 shadow-sm select-none">
      {/* Top Header: Controls & Views */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              Sprint milestones and code release deadlines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Month / Week / Day toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-xl text-xs font-semibold">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-white dark:bg-[#1E2530] text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-1 border border-gray-200 dark:border-white/10 rounded-xl p-1 bg-gray-50/50 dark:bg-white/[0.02]">
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handlePrev}
              className="p-1 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openCreateTaskModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Event</span>
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-px mt-4 text-center font-mono text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mt-1">
        {calendarCells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={'empty-' + idx}
                className="min-h-[100px] rounded-2xl bg-gray-50/30 dark:bg-white/[0.01] border border-transparent"
              />
            );
          }

          const dayTasks = getTasksForDay(day);
          const isToday = day === 23 && month === 8;

          return (
            <div
              key={'day-' + day}
              className={`min-h-[110px] p-2 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                isToday
                  ? 'border-indigo-500/60 bg-indigo-50/30 dark:bg-indigo-500/10 shadow-xs ring-1 ring-indigo-500/30'
                  : 'border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {day}
                </span>

                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-mono text-gray-400">
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                )}
              </div>

              {/* Day Tasks List */}
              <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-20">
                {dayTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => openTaskDrawer(t)}
                    className="w-full text-left p-1 rounded-md text-[11px] font-medium bg-white dark:bg-[#151A21] border border-gray-200/80 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-400 truncate shadow-2xs block transition-all"
                  >
                    <div className="flex items-center gap-1 truncate">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          t.priority === 'critical'
                            ? 'bg-rose-500'
                            : t.priority === 'high'
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                      />
                      <span className="truncate text-gray-800 dark:text-gray-200">{t.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
