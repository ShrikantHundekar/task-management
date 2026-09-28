import React, { useState } from 'react';
import {
  FolderGit2,
  Sparkles,
  Plus,
  GitBranch,
  Star,
  ExternalLink,
  Users,
  CheckCircle2,
  Kanban as KanbanIcon,
  Calendar as CalendarIcon,
  Code2,
  BarChart3,
  ListFilter,
} from 'lucide-react';
import { Project, Task } from '../../types';
import { TaskCard } from '../tasks/TaskCard';
import { KanbanBoard } from '../kanban/KanbanBoard';
import { DeveloperCalendar } from '../calendar/DeveloperCalendar';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { useProjectStore } from '../../store/projectStore';
import { formatDate } from '../../lib/utils';

interface ProjectDetailsWorkspaceProps {
  project: Project;
  tasks: Task[];
}

export const ProjectDetailsWorkspace: React.FC<ProjectDetailsWorkspaceProps> = ({ project, tasks }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'kanban' | 'calendar' | 'overview'>('tasks');
  const { openCreateTaskModal, openCopilot } = useAppStore();
  const { toggleFavorite } = useProjectStore();

  const projectTasks = tasks.filter((t) => t.project_id === project.id);
  const completedTasks = projectTasks.filter((t) => t.status === 'done');
  const progress =
    projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;

  return (
    <div className="space-y-6 select-none">
      {/* Project Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#11151A] shadow-xs select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/50 dark:border-indigo-500/20">
              <FolderGit2 className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {project.name}
                </h1>
                <button
                  onClick={() => toggleFavorite(project.id)}
                  aria-label={project.is_favorite ? 'Remove project from favorites' : 'Add project to favorites'}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Star
                    className={`w-4 h-4 ${
                      project.is_favorite ? 'text-amber-400 fill-amber-400' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono flex-wrap">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {project.framework || project.programming_language}
                </span>
                <span>•</span>
                <span>Created {formatDate(project.created_at)}</span>
                {project.repository_url && (
                  <>
                    <span>•</span>
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-indigo-500 transition-colors"
                    >
                      <GitBranch className="w-3 h-3" />
                      <span>repo</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </>
                )}
              </div>

              {project.description && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2.5 max-w-2xl leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <Button
              variant="ai"
              size="sm"
              onClick={() =>
                openCopilot({
                  prompt: `Analyze project architecture and generate a technical roadmap for "${project.name}" (${project.framework}).`,
                })
              }
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              AI Roadmap
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

        {/* Progress Bar & KPI metrics */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-gray-400 uppercase text-[10px] block">Overall Progress</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-base text-gray-900 dark:text-white">{progress}%</span>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <span className="text-gray-400 uppercase text-[10px] block">Tasks In Scope</span>
            <span className="font-bold text-base text-gray-900 dark:text-white mt-1 block">
              {projectTasks.length} tasks
            </span>
          </div>

          <div>
            <span className="text-gray-400 uppercase text-[10px] block">Completed</span>
            <span className="font-bold text-base text-emerald-600 dark:text-emerald-400 mt-1 block">
              {completedTasks.length} shipped
            </span>
          </div>

          <div>
            <span className="text-gray-400 uppercase text-[10px] block">Team Members</span>
            <span className="font-bold text-base text-gray-900 dark:text-white mt-1 block">
              {project.members_count || 3} developers
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200/80 dark:border-white/10 pb-2 text-xs font-semibold">
        {[
          { id: 'tasks', label: `Tasks (${projectTasks.length})`, icon: ListFilter },
          { id: 'kanban', label: 'Kanban Board', icon: KanbanIcon },
          { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 gap-3 animate-fade-in">
          {projectTasks.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
              <CheckCircle2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                No tasks in this project yet
              </p>
              <p className="text-xs text-gray-400 mt-1">Create your first task or use AI to generate a plan.</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={openCreateTaskModal}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Create Task
              </Button>
            </div>
          ) : (
            projectTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      )}

      {activeTab === 'kanban' && (
        <div className="animate-fade-in">
          <KanbanBoard tasks={projectTasks} />
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="animate-fade-in">
          <DeveloperCalendar tasks={projectTasks} />
        </div>
      )}
    </div>
  );
};
