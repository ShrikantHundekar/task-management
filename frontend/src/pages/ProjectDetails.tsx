import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { ProjectDetailsWorkspace } from '../components/projects/ProjectDetailsWorkspace';
import { Project } from '../types';
import { ChevronLeft } from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  useEffect(() => {
    if (id) {
      const found = projects.find((p) => p.id === Number(id));
      if (found) setProject(found);
    }
  }, [id, projects]);

  if (!project) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Loading project workspace...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4">
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </button>

      <ProjectDetailsWorkspace project={project} tasks={tasks} />
    </div>
  );
};
