import React, { useEffect } from 'react';
import { Plus, FolderGit2, Sparkles, Star } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useAppStore } from '../store/useAppStore';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Button } from '../components/ui/Button';

export const ProjectsPage: React.FC = () => {
  const { projects, fetchProjects } = useProjectStore();
  const { openCreateProjectModal, openCopilot } = useAppStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const favorites = projects.filter((p) => p.is_favorite);
  const otherProjects = projects.filter((p) => !p.is_favorite);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Codebase Projects
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Repositories, tech stacks, and team delivery velocity
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ai"
            size="sm"
            onClick={() =>
              openCopilot({
                prompt: 'Suggest new microservice or module architecture ideas for our current project stack.',
              })
            }
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            AI Architecture Advisor
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={openCreateProjectModal}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Favorites Section if any */}
      {favorites.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-gray-700 dark:text-gray-300">
              Starred Repositories
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      {/* All Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-gray-700 dark:text-gray-300">
            All Repositories ({projects.length})
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
