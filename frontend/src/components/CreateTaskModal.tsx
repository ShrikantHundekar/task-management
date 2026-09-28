import React, { useState } from 'react';
import { useCopilotStore } from '../store/copilotStore';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { api } from '../services/api';
import {
  X,
  Plus,
  Sparkles,
  Code2,
  Clock,
  Tag,
  FolderGit2,
  Layers,
  AlertCircle
} from 'lucide-react';
import { TaskPriority, TaskStatus } from '../types';

export const CreateTaskModal: React.FC = () => {
  const { activeModal, closeModal } = useCopilotStore();
  const { projects, selectedProjectId } = useProjectStore();
  const { createTask } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<number>(selectedProjectId || (projects[0]?.id ?? 1));
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [programmingLanguage, setProgrammingLanguage] = useState('Python');
  const [framework, setFramework] = useState('FastAPI');
  const [estimatedHours, setEstimatedHours] = useState('4.0');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (activeModal !== 'createTask') return null;

  const handleAiDraft = async () => {
    if (!title.trim()) {
      setError('Please provide a task title first so the AI can draft specs.');
      return;
    }
    setError(null);
    setIsAiGenerating(true);
    try {
      const res = await api.runAiAction({
        action: 'explain_task',
        prompt: `Draft a concise technical specification and initial code boilerplate for the task: "${title}". Use language: ${programmingLanguage}.`,
        programming_language: programmingLanguage,
      });

      setDescription(res.content.slice(0, 300) + '...');
      if (!codeSnippet) {
        setCodeSnippet(`# Boilerplate for ${title}\n\ndef execute_task():\n    pass\n`);
      }
    } catch (err: any) {
      setError(err.message || 'AI generation failed');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        project_id: Number(projectId),
        title,
        description,
        status,
        priority,
        programming_language: programmingLanguage,
        framework,
        estimated_hours: parseFloat(estimatedHours) || 2.0,
        code_snippet: codeSnippet,
        assignee_name: 'Alex Chen',
      });
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-xl w-full border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Create New Coding Task</h2>
              <p className="text-xs text-gray-500">Add an issue, bug, or feature to your development backlog</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Title with AI Generate button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-gray-700 dark:text-gray-300">Task Title *</label>
              <button
                type="button"
                onClick={handleAiDraft}
                disabled={isAiGenerating}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isAiGenerating ? 'Drafting with Groq...' : 'AI Auto-Draft Specs'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Rate Limiter Middleware for Redis Token Bucket"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Project & Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Language, Framework & Estimated Hours */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Language</label>
              <input
                type="text"
                value={programmingLanguage}
                onChange={(e) => setProgrammingLanguage(e.target.value)}
                placeholder="e.g. Python, TypeScript"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Framework</label>
              <input
                type="text"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                placeholder="e.g. FastAPI, React"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Est. Hours</label>
              <input
                type="number"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Description / Spec</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline technical requirements, API signatures, edge conditions..."
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Code snippet initial */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center justify-between">
              <span>Code Snippet (Optional)</span>
              <span className="text-[10px] text-gray-400 font-mono">Editable in Monaco</span>
            </label>
            <textarea
              rows={3}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="// Paste initial code, interface definitions, or problem code"
              className="w-full font-mono text-[11px] p-2.5 bg-gray-900 text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
