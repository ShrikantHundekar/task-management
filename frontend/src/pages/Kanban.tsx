import React, { useEffect, useState } from 'react';
import { Plus, Kanban as KanbanIcon, Sparkles, Filter } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useAppStore } from '../store/useAppStore';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { Button } from '../components/ui/Button';

export const KanbanPage: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const { openCreateTaskModal, openCopilot } = useAppStore();

  const [selectedProjectId, setSelectedProjectId] = useState<number | 'all'>('all');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  const filteredTasks =
    selectedProjectId === 'all'
      ? tasks
      : tasks.filter((t) => t.project_id === selectedProjectId);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-[1700px] mx-auto select-none">
      {/* Kanban Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <KanbanIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Kanban Board
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Fluid drag-and-drop sprint execution across 6 lifecycle stages
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Project filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#151A21] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedProjectId}
              onChange={(e) =>
                setSelectedProjectId(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Repositories</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="ai"
            size="sm"
            onClick={() =>
              openCopilot({
                prompt: 'Analyze current board bottlenecks: Which cards have spent the longest in Testing or Review?',
              })
            }
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Analyze Bottlenecks
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={openCreateTaskModal}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Interactive Kanban Board */}
      <KanbanBoard tasks={filteredTasks} />
    </div>
  );
};
