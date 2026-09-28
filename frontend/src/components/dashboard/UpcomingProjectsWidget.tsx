import React from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Plus, ArrowRight, GitBranch } from 'lucide-react';
import { Project } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface UpcomingProjectsWidgetProps {
  projects: Project[];
}

export const UpcomingProjectsWidget: React.FC<UpcomingProjectsWidgetProps> = ({ projects }) => {
  const { openCreateProjectModal } = useAppStore();

  return (
    <div className="rounded-2xl p-5 border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] shadow-xs select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Active Projects</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Repositories & Codebases</p>
        </div>
        <button
          onClick={openCreateProjectModal}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      <div className="space-y-3">
        {projects.slice(0, 4).map((proj) => {
          const progress =
            proj.tasks_count > 0 ? Math.round((proj.completed_tasks_count / proj.tasks_count) * 100) : 0;

          return (
            <Link
              key={proj.id}
              to={`/projects/${proj.id}`}
              className="block p-3 rounded-xl border border-gray-100 dark:border-white/5 hover:border-indigo-400 dark:hover:border-indigo-500/30 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <FolderGit2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {proj.name}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400">
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mt-2.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-2">
                <span className="truncate">{proj.framework || proj.programming_language}</span>
                <span>
                  {proj.completed_tasks_count}/{proj.tasks_count} tasks
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 text-center">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <span>View all repositories</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
