import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Sparkles,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  MessageSquare,
  Code2,
} from 'lucide-react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { useTaskStore } from '../../store/taskStore';
import { useAppStore } from '../../store/useAppStore';
import { formatDate } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  onOpen?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onOpen }) => {
  const { updateTaskStatus, deleteTask, openTaskDrawer } = useTaskStore();
  const { openCopilot } = useAppStore();

  const isDone = task.status === 'done';
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.is_completed).length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : isDone ? 100 : 0;

  const handleToggleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTaskStatus(task.id, isDone ? 'todo' : 'done');
  };

  const handleAskAi = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCopilot({
      taskId: task.id,
      prompt: `Analyze task: ${task.title}. Provide implementation suggestions.`,
      codeSnippet: task.code_snippet,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete task "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={() => (onOpen ? onOpen() : openTaskDrawer(task))}
      className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-150 cursor-pointer select-none bg-white dark:bg-[#151A21] shadow-xs hover:shadow-md ${
        isDone
          ? 'border-gray-200/60 dark:border-white/5 opacity-75'
          : 'border-gray-200/80 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/40'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Animated Checkbox */}
        <button
          onClick={handleToggleDone}
          aria-label={isDone ? `Mark task ${task.title} as incomplete` : `Mark task ${task.title} as complete`}
          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 shrink-0 ${
            isDone
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
              : 'border-gray-300 dark:border-white/20 hover:border-indigo-500 bg-transparent'
          }`}
        >
          {isDone && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500 font-semibold">
                {task.task_number}
              </span>
              <Badge variant="priority" priority={task.priority} size="sm" />
              <Badge variant="status" status={task.status} size="sm" />
              {task.ai_assisted && <Badge variant="ai" size="sm" />}
            </div>

            {/* Hover Actions Bar */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <button
                onClick={handleAskAi}
                className="p-1 rounded-md text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/10"
                title="Ask AI"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openTaskDrawer(task);
                }}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                title="Open Details"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded-md text-gray-400 hover:text-rose-600 hover:bg-gray-100 dark:hover:bg-white/10"
                title="Delete Task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3
            className={`text-sm sm:text-base font-semibold mt-1.5 transition-colors line-clamp-1 ${
              isDone ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
            }`}
          >
            {task.title}
          </h3>

          {/* Labels & Tech Tags */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {task.project_name && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                {task.project_name}
              </span>
            )}
            {task.labels?.map((label) => (
              <span
                key={label.id}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-white/5"
              >
                {label.name}
              </span>
            ))}
          </div>

          {/* Progress Bar & Subtask count */}
          {totalSubtasks > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1 font-mono">
                <span>
                  {completedSubtasks}/{totalSubtasks} subtasks
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              {task.due_date && (
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(task.due_date)}</span>
                </div>
              )}
              {task.code_snippet && (
                <div className="flex items-center gap-1 text-[11px] text-indigo-500 font-mono">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Snippet</span>
                </div>
              )}
              {task.comments_count > 0 && (
                <div className="flex items-center gap-1 text-[11px]">
                  <MessageSquare className="w-3 h-3" />
                  <span>{task.comments_count}</span>
                </div>
              )}
            </div>

            {/* Assignee Avatar */}
            {task.assignee_avatar && (
              <img
                src={task.assignee_avatar}
                alt={task.assignee_name || 'Assignee'}
                title={task.assignee_name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white dark:ring-black"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
