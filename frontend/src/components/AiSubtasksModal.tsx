import React, { useState, useEffect } from 'react';
import { useCopilotStore } from '../store/copilotStore';
import { useTaskStore } from '../store/taskStore';
import { api } from '../services/api';
import {
  X,
  Sparkles,
  ListTree,
  CheckSquare,
  Square,
  Plus,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';

export const AiSubtasksModal: React.FC = () => {
  const { activeModal, modalData, closeModal } = useCopilotStore();
  const { acceptBatchSubtasks } = useTaskStore();

  const [isLoading, setIsLoading] = useState(false);
  const [subtaskItems, setSubtaskItems] = useState<{ title: string; selected: boolean }[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const task = modalData?.task;

  useEffect(() => {
    if (activeModal === 'subtasks' && task) {
      fetchDecomposedSubtasks();
    }
  }, [activeModal, task]);

  const fetchDecomposedSubtasks = async () => {
    if (!task) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.runAiAction({
        action: 'break_subtasks',
        task_id: task.id,
        code_snippet: task.code_snippet,
        programming_language: task.programming_language,
      });

      if (res.structured_data?.subtasks && Array.isArray(res.structured_data.subtasks)) {
        setSubtaskItems(res.structured_data.subtasks.map((t: string) => ({ title: t, selected: true })));
      } else {
        // Parse from content lines
        const lines = res.content
          .split('\n')
          .map((l: string) => l.trim())
          .filter((l: string) => l.startsWith('-') || l.startsWith('*') || /^\d+\./.test(l))
          .map((l: string) => l.replace(/^[-*]|\d+\.\s*/g, '').trim())
          .filter((l: string) => l.length > 5);

        if (lines.length > 0) {
          setSubtaskItems(lines.map((title: string) => ({ title, selected: true })));
        } else {
          setSubtaskItems([
            { title: `Initialize architectural spec for ${task.title}`, selected: true },
            { title: `Write core business logic and validate edge cases`, selected: true },
            { title: `Implement database migration and schema indexes`, selected: true },
            { title: `Write automated integration tests with mock fixtures`, selected: true },
          ]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to decompose subtasks');
    } finally {
      setIsLoading(false);
    }
  };

  if (activeModal !== 'subtasks' || !task) return null;

  const toggleSelect = (index: number) => {
    setSubtaskItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setSubtaskItems([...subtaskItems, { title: customInput.trim(), selected: true }]);
    setCustomInput('');
  };

  const selectAll = (val: boolean) => {
    setSubtaskItems((prev) => prev.map((item) => ({ ...item, selected: val })));
  };

  const handleAcceptBatch = async () => {
    const selectedTitles = subtaskItems.filter((s) => s.selected).map((s) => s.title);
    if (selectedTitles.length === 0) return;

    setIsLoading(true);
    try {
      await acceptBatchSubtasks(task.id, selectedTitles);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        closeModal();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save subtasks to task');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCount = subtaskItems.filter((s) => s.selected).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-xl w-full border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ListTree className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>AI Subtask Decomposition</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono">
                  Groq Powered
                </span>
              </h2>
              <p className="text-xs text-gray-500 truncate max-w-md">
                Decomposing: <span className="font-mono text-gray-700 dark:text-gray-300 font-medium">{task.task_number}</span> - {task.title}
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isLoading && subtaskItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                Groq LLaMA 3.3 is analyzing task context and technical scope...
              </p>
            </div>
          ) : (
            <>
              {/* Controls bar */}
              <div className="flex items-center justify-between text-xs pb-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">
                  Select subtasks to accept ({selectedCount}/{subtaskItems.length})
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => selectAll(true)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-[11px]"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <button
                    onClick={() => selectAll(false)}
                    className="text-gray-500 hover:underline font-medium text-[11px]"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Subtask Checkboxes */}
              <div className="space-y-2">
                {subtaskItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleSelect(idx)}
                    className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      item.selected
                        ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/80 text-gray-900 dark:text-gray-100'
                        : 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <button type="button" className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0">
                      {item.selected ? (
                        <CheckSquare className="w-4 h-4 fill-indigo-100 dark:fill-indigo-950" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <span className="leading-snug">{item.title}</span>
                  </div>
                ))}
              </div>

              {/* Add custom item */}
              <form onSubmit={handleAddCustom} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Add custom subtask item..."
                  className="flex-1 px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium flex items-center gap-1 disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={() => fetchDecomposedSubtasks()}
            disabled={isLoading}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 font-medium disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Regenerate with Groq</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={closeModal}
              className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAcceptBatch}
              disabled={selectedCount === 0 || isLoading || isSuccess}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 flex items-center gap-1.5 shadow-sm transition-all"
            >
              {isSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Subtasks Saved!</span>
                </>
              ) : (
                <>
                  <span>Accept {selectedCount} Subtasks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
