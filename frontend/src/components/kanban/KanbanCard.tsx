import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, MoreHorizontal, CheckSquare, MessageSquare } from 'lucide-react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/utils';
import { useTaskStore } from '../../store/taskStore';

interface KanbanCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, onDragStart }) => {
  const { openTaskDrawer } = useTaskStore();

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.is_completed).length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <motion.div
      layout
      draggable
      onDragStart={(e) => onDragStart(e as any, task.id)}
      onClick={() => openTaskDrawer(task)}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="p-3.5 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] hover:border-indigo-400 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none group"
    >
      {/* Top Header: Priority Badge & AI indicator */}
      <div className="flex items-center justify-between gap-1.5 mb-2">
        <Badge variant="priority" priority={task.priority} size="sm" />
        <div className="flex items-center gap-1">
          {task.ai_assisted && <Badge variant="ai" size="sm" />}
          <span className="font-mono text-[10px] text-gray-400 font-medium">
            {task.task_number}
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {task.title}
      </h4>

      {/* Description preview */}
      {task.description && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex items-center gap-1 mt-2.5 flex-wrap">
          {task.labels.map((lbl) => (
            <span
              key={lbl.id}
              className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
            >
              {lbl.name}
            </span>
          ))}
        </div>
      )}

      {/* Progress & Subtasks */}
      {totalSubtasks > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mb-1">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-indigo-500" />
              {completedSubtasks}/{totalSubtasks}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer metadata */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-2">
          {task.due_date && (
            <div className="flex items-center gap-1 text-[10px]">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.due_date)}</span>
            </div>
          )}
          {task.comments_count > 0 && (
            <div className="flex items-center gap-1 text-[10px]">
              <MessageSquare className="w-3 h-3" />
              <span>{task.comments_count}</span>
            </div>
          )}
        </div>

        {task.assignee_avatar && (
          <img
            src={task.assignee_avatar}
            alt={task.assignee_name || 'Assignee'}
            title={task.assignee_name}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-white dark:ring-black"
          />
        )}
      </div>
    </motion.div>
  );
};
