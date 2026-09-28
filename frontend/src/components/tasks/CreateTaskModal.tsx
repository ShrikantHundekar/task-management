import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { TaskPriority, TaskStatus } from '../../types';
import { CheckSquare, Sparkles, Code2 } from 'lucide-react';

export const CreateTaskModal: React.FC = () => {
  const { createTaskModalOpen, closeCreateTaskModal } = useAppStore();
  const { createTask } = useTaskStore();
  const { projects } = useProjectStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<number>(1);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [aiAssisted, setAiAssisted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        project_id: projectId,
        priority,
        status,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        code_snippet: codeSnippet.trim() || undefined,
        ai_assisted: aiAssisted,
      });

      setTitle('');
      setDescription('');
      setCodeSnippet('');
      closeCreateTaskModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={createTaskModalOpen}
      onClose={closeCreateTaskModal}
      maxWidth="xl"
      title={
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-500" />
          <span>Create Engineering Task</span>
        </div>
      }
      description="Plan a new feature, bug fix, or technical refactor"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase font-mono mb-1">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase font-mono mb-1">
            Description & Context
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Technical details, problem statement, edge cases..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase font-mono mb-1">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#151A21] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase font-mono mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#151A21] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase font-mono mb-1">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#151A21] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="testing">Testing</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase font-mono mb-1">
            Due Date (Optional)
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full sm:w-1/2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase font-mono mb-1">
            Initial Code / Error Stack (Optional)
          </label>
          <textarea
            rows={3}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="Paste relevant snippet or error stack here..."
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#0B0D10] text-xs font-mono text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* AI Auto-generate Subtasks Checkbox */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
          <input
            type="checkbox"
            id="ai-auto-breakdown"
            checked={aiAssisted}
            onChange={(e) => setAiAssisted(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="ai-auto-breakdown" className="text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 cursor-pointer font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Autonomous AI Task Planner (decompose into 3-5 subtasks automatically)</span>
          </label>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-2.5">
          <Button type="button" variant="ghost" size="sm" onClick={closeCreateTaskModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<CheckSquare className="w-3.5 h-3.5" />}
          >
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
