import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useCopilotStore } from '../store/copilotStore';
import { Task, TaskStatus } from '../types';
import {
  Plus,
  Sparkles,
  MoreVertical,
  CheckCircle2,
  Clock,
  Code2,
  AlertTriangle,
  FolderGit2,
  ListTree,
  Bug,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const COLUMNS: { id: TaskStatus; title: string; color: string; bg: string }[] = [
  { id: 'backlog', title: 'Backlog', color: '#64748B', bg: 'rgba(100, 116, 139, 0.1)' },
  { id: 'todo', title: 'To Do', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  { id: 'in_progress', title: 'In Progress', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  { id: 'in_review', title: 'In Review', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
  { id: 'testing', title: 'Testing', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)' },
  { id: 'done', title: 'Done', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
];

export const KanbanPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks, updateTaskStatus } = useTaskStore();
  const { selectedProjectId } = useProjectStore();
  const { openModal, openCopilot } = useCopilotStore();

  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks(selectedProjectId || undefined);
  }, [selectedProjectId]);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('text/plain', String(id));
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData('text/plain') || String(draggedTaskId);
    const id = Number(idStr);
    if (id) {
      await updateTaskStatus(id, status);
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col p-4 space-y-3 select-none overflow-hidden animate-in fade-in duration-150">
      {/* Kanban Subheader */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
            Sprint Kanban Board
          </h1>
          <span className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full font-mono">
            {tasks.length} total tasks
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal('createTask')}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Board Columns container */}
      <div className="flex-1 flex gap-3 overflow-x-auto pb-2">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="w-72 shrink-0 flex flex-col bg-gray-100/70 dark:bg-gray-900/60 rounded-xl border border-gray-200/80 dark:border-gray-800/80 p-2.5 max-h-full"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 px-1 border-b border-gray-200 dark:border-gray-800/60 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    {col.title}
                  </h3>
                  <span className="text-[10px] bg-white dark:bg-gray-800 text-gray-500 px-1.5 py-0.2 rounded font-mono font-medium border border-gray-200 dark:border-gray-700">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => openModal('createTask')}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {colTasks.map((task) => {
                  const completedSubtasks = task.subtasks.filter((s) => s.is_completed).length;
                  const totalSubtasks = task.subtasks.length;
                  const progressPct = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      className="group bg-white dark:bg-gray-800/90 rounded-lg p-3 border border-gray-200 dark:border-gray-700/70 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500/80 transition-all cursor-grab active:cursor-grabbing hover:shadow-md space-y-2"
                    >
                      {/* Card Top: Number & Priority */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          {task.task_number}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            task.priority === 'critical'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                              : task.priority === 'high'
                              ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-snug line-clamp-2">
                        {task.title}
                      </h4>

                      {/* Subtasks Progress Bar */}
                      {totalSubtasks > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                            <span>Subtasks</span>
                            <span>{completedSubtasks}/{totalSubtasks}</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Card Bottom: Tech stack, Assignee, AI trigger */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700/40 text-[10px] text-gray-400">
                        <div className="flex items-center gap-1 font-mono text-gray-500 dark:text-gray-400">
                          <Code2 className="w-3 h-3 text-indigo-500" />
                          <span>{task.programming_language || 'Code'}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* AI Action Quick Trigger */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('subtasks', { task });
                            }}
                            className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                            title="Decompose Subtasks with Groq"
                          >
                            <ListTree className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('review', { task });
                            }}
                            className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                            title="Code Review with Groq"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>

                          {/* Assignee Avatar */}
                          <img
                            src={task.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'}
                            alt={task.assignee_name || 'Assignee'}
                            className="w-5 h-5 rounded-full ring-1 ring-gray-300 dark:ring-gray-600 object-cover ml-1"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-gray-400 text-[11px]">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
