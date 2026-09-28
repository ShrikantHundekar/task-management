import React, { useState } from 'react';
import { Plus, Sparkles, Calendar, Tag, ChevronDown, Check } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { TaskPriority } from '../../types';

export const QuickAddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState<number>(1);
  const [isFocused, setIsFocused] = useState(false);
  const [isAiAssisted, setIsAiAssisted] = useState(false);

  const { createTask } = useTaskStore();
  const { projects } = useProjectStore();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && title.trim()) {
      e.preventDefault();
      await createTask({
        title: title.trim(),
        priority,
        project_id: projectId,
        ai_assisted: isAiAssisted,
        status: 'todo',
      });
      setTitle('');
      setIsFocused(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-[#151A21] ${
        isFocused
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
          : 'border-gray-200/80 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Plus className="w-4 h-4 text-indigo-500 shrink-0" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done? Press Enter to create task..."
          className="w-full bg-transparent border-0 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0"
        />

        {/* AI Auto-Breakdown Toggle */}
        <button
          type="button"
          onClick={() => setIsAiAssisted(!isAiAssisted)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 ${
            isAiAssisted
              ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Auto-generate subtasks with CodeFlow AI"
        >
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span className="hidden sm:inline">AI Breakdown</span>
        </button>
      </div>

      {/* Expanded Inline Controls when active */}
      {isFocused && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-xs animate-fade-in">
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Selector */}
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-[11px] font-mono">Priority:</span>
              {(['low', 'medium', 'high', 'critical'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-2 py-0.5 rounded font-mono uppercase text-[10px] transition-colors ${
                    priority === p
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Project Selector */}
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-[11px] font-mono">Project:</span>
              <select
                value={projectId}
                onChange={(e) => setProjectId(Number(e.target.value))}
                className="bg-transparent border border-gray-200 dark:border-white/10 rounded px-2 py-0.5 text-xs text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id} className="bg-white dark:bg-[#151A21]">
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFocused(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2 py-1"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!title.trim()}
              onClick={async () => {
                if (!title.trim()) return;
                await createTask({
                  title: title.trim(),
                  priority,
                  project_id: projectId,
                  ai_assisted: isAiAssisted,
                  status: 'todo',
                });
                setTitle('');
                setIsFocused(false);
              }}
              className="px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
              Create Task ↵
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
