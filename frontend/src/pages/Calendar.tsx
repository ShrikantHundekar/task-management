import React, { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { DeveloperCalendar } from '../components/calendar/DeveloperCalendar';

export const CalendarPage: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Delivery Calendar
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Track sprint deadlines, code freeze dates, and release schedule
        </p>
      </div>

      <DeveloperCalendar tasks={tasks} />
    </div>
  );
};
