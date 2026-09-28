import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Star,
  Users,
  CheckCircle2,
  MoreVertical,
  ExternalLink,
  Code2,
  Trash2,
} from 'lucide-react';
import { Project } from '../../types';
import { useProjectStore } from '../../store/projectStore';
import { formatDate } from '../../lib/utils';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { toggleFavorite, deleteProject } = useProjectStore();

  const progress =
    project.tasks_count > 0 ? Math.round((project.completed_tasks_count / project.tasks_count) * 100) : 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      deleteProject(project.id);
    }
  };

  const handleToggleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(project.id);
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="group relative rounded-2xl p-5 border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] hover:border-indigo-400 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-lg transition-all select-none"
    >
      <Link to={`/projects/${project.id}`} className="block">
        {/* Header: Icon, Name, Favorite Star */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/50 dark:border-indigo-500/20 group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {project.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                {project.framework || project.programming_language || 'Full-Stack'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleStar}
              aria-label={project.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              title="Favorite"
            >
              <Star
                className={`w-4 h-4 ${
                  project.is_favorite ? 'text-amber-400 fill-amber-400' : 'text-gray-400'
                }`}
              />
            </button>
            <button
              onClick={handleDelete}
              aria-label={`Delete project ${project.name}`}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-mono text-gray-500 dark:text-gray-400 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer info: Tasks count, members, repository */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              {project.completed_tasks_count}/{project.tasks_count} tasks
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {project.members_count || 2} members
            </span>
          </div>

          <span className="text-[11px] text-gray-400">
            {formatDate(project.updated_at) ? `Updated ${formatDate(project.updated_at)}` : 'Active'}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};
