import React, { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { KanbanCard } from './KanbanCard';
import { useTaskStore } from '../../store/taskStore';
import { useAppStore } from '../../store/useAppStore';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  accentColor: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, accentColor }) => {
  const [isOver, setIsOver] = useState(false);
  const { updateTaskStatus } = useTaskStore();
  const { openCreateTaskModal } = useAppStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (taskIdStr) {
      const taskId = Number(taskIdStr);
      updateTaskStatus(taskId, id);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('text/plain', String(taskId));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col w-72 sm:w-80 shrink-0 rounded-2xl p-3 border transition-colors select-none ${
        isOver
          ? 'bg-indigo-50/40 dark:bg-indigo-500/10 border-indigo-400 dark:border-indigo-500'
          : 'bg-gray-50/70 dark:bg-[#11151A]/70 border-gray-200/60 dark:border-white/5'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
            {title}
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-gray-200/60 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={openCreateTaskModal}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task Cards Stack */}
      <div className="flex-1 overflow-y-auto space-y-2.5 min-h-[400px] pr-0.5">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onDragStart={handleDragStart} />
        ))}

        {tasks.length === 0 && (
          <div className="h-32 flex items-center justify-center border border-dashed border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-400">
            Drop here
          </div>
        )}
      </div>

      {/* Quick Add Button at bottom of column */}
      <button
        onClick={openCreateTaskModal}
        className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-white/50 dark:hover:bg-white/[0.02] transition-colors font-medium"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add task</span>
      </button>
    </div>
  );
};
