import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  Code2,
  Copy,
  MessageSquare,
  Clock,
  Send,
  User,
  CheckCircle2,
  FolderGit2,
} from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TaskStatus, TaskPriority, Subtask } from '../../types';
import { formatDate } from '../../lib/utils';
import { aiService } from '../../services/aiService';

export const TaskDetailsDrawer: React.FC = () => {
  const { activeTask, isDrawerOpen, closeTaskDrawer, updateTask, updateTaskStatus, toggleSubtask, addSubtask, deleteSubtask, acceptBatchSubtasks } =
    useTaskStore();
  const { addToast, openCopilot } = useAppStore();

  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'code' | 'ai' | 'comments'>('details');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!activeTask || !isDrawerOpen) return null;

  const totalSubtasks = activeTask.subtasks?.length || 0;
  const completedSubtasks = activeTask.subtasks?.filter((s) => s.is_completed).length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    await addSubtask(activeTask.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleCopyCode = () => {
    if (activeTask.code_snippet) {
      navigator.clipboard.writeText(activeTask.code_snippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      addToast({ title: 'Code Copied', description: 'Snippet copied to clipboard.', type: 'info' });
    }
  };

  const handleRunAiAction = async (actionType: string) => {
    setIsAiGenerating(true);
    try {
      const res = await aiService.runAction({
        action: actionType,
        task_id: activeTask.id,
        prompt: `Action ${actionType} on task: ${activeTask.title}`,
        code_snippet: activeTask.code_snippet,
      });

      if (actionType === 'subtasks' && res.structured_data) {
        await acceptBatchSubtasks(activeTask.id, res.structured_data);
        setActiveTab('subtasks');
      } else {
        openCopilot({
          taskId: activeTask.id,
          prompt: `Action: ${actionType} for ${activeTask.title}`,
          codeSnippet: activeTask.code_snippet,
        });
      }
    } catch {
      addToast({ title: 'AI Request Failed', description: 'Could not contact AI service.', type: 'error' });
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeTaskDrawer}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Sliding Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#11151A] border-l border-gray-200 dark:border-white/10 shadow-2xl flex flex-col h-full z-10"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/80 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                {activeTask.task_number}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {activeTask.project_name || 'Project'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ai"
                size="xs"
                onClick={() => handleRunAiAction('subtasks')}
                isLoading={isAiGenerating}
                leftIcon={<Sparkles className="w-3 h-3" />}
              >
                AI Subtasks
              </Button>

              <button
                onClick={closeTaskDrawer}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {activeTask.title}
              </h1>
            </div>

            {/* Quick Properties Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#151A21] border border-gray-100 dark:border-white/5 text-xs">
              <div>
                <span className="text-gray-400 font-mono text-[10px] block uppercase">Status</span>
                <select
                  value={activeTask.status}
                  onChange={(e) => updateTaskStatus(activeTask.id, e.target.value as TaskStatus)}
                  className="mt-1 bg-transparent font-semibold text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value="backlog" className="bg-white dark:bg-[#151A21]">Backlog</option>
                  <option value="todo" className="bg-white dark:bg-[#151A21]">Todo</option>
                  <option value="in_progress" className="bg-white dark:bg-[#151A21]">In Progress</option>
                  <option value="in_review" className="bg-white dark:bg-[#151A21]">In Review</option>
                  <option value="testing" className="bg-white dark:bg-[#151A21]">Testing</option>
                  <option value="done" className="bg-white dark:bg-[#151A21]">Done</option>
                </select>
              </div>

              <div>
                <span className="text-gray-400 font-mono text-[10px] block uppercase">Priority</span>
                <select
                  value={activeTask.priority}
                  onChange={(e) => updateTask(activeTask.id, { priority: e.target.value as TaskPriority })}
                  className="mt-1 bg-transparent font-semibold text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer uppercase"
                >
                  <option value="low" className="bg-white dark:bg-[#151A21]">Low</option>
                  <option value="medium" className="bg-white dark:bg-[#151A21]">Medium</option>
                  <option value="high" className="bg-white dark:bg-[#151A21]">High</option>
                  <option value="critical" className="bg-white dark:bg-[#151A21]">Critical</option>
                </select>
              </div>

              <div>
                <span className="text-gray-400 font-mono text-[10px] block uppercase">Due Date</span>
                <span className="mt-1 font-semibold text-gray-800 dark:text-gray-200 block truncate">
                  {formatDate(activeTask.due_date) || 'No deadline'}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-mono text-[10px] block uppercase">Assignee</span>
                <span className="mt-1 font-semibold text-gray-800 dark:text-gray-200 block truncate">
                  {activeTask.assignee_name || 'Unassigned'}
                </span>
              </div>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200/80 dark:border-white/10 pb-1 text-xs font-semibold">
              {[
                { id: 'details', label: 'Details' },
                { id: 'subtasks', label: `Subtasks (${completedSubtasks}/${totalSubtasks})` },
                { id: 'code', label: 'Code Snippet' },
                { id: 'ai', label: 'AI Actions' },
                { id: 'comments', label: 'Activity & Comments' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: Details */}
            {activeTab === 'details' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-xs font-mono uppercase text-gray-400 font-bold mb-2">Description</h3>
                  <div className="p-4 rounded-xl bg-gray-50/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {activeTask.description || 'No description provided.'}
                  </div>
                </div>

                {activeTask.acceptance_criteria && activeTask.acceptance_criteria.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono uppercase text-gray-400 font-bold mb-2">
                      Acceptance Criteria
                    </h3>
                    <ul className="space-y-2">
                      {activeTask.acceptance_criteria.map((crit, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Subtasks */}
            {activeTab === 'subtasks' && (
              <div className="space-y-4 animate-fade-in">
                {/* Progress bar */}
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5 text-indigo-900 dark:text-indigo-300">
                    <span className="font-semibold">Checklist Completion</span>
                    <span>
                      {completedSubtasks} of {totalSubtasks} completed ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-indigo-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Subtask items checklist */}
                <div className="space-y-1.5">
                  {activeTask.subtasks?.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100/50 dark:hover:bg-white/[0.05] transition-colors group"
                    >
                      <button
                        onClick={() => toggleSubtask(activeTask.id, st.id, !st.is_completed)}
                        className="flex items-center gap-3 text-left flex-1 min-w-0"
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                            st.is_completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-gray-300 dark:border-white/20'
                          }`}
                        >
                          {st.is_completed && <Check className="w-3 h-3 stroke-[2.5]" />}
                        </div>
                        <span
                          className={`text-xs transition-colors truncate ${
                            st.is_completed
                              ? 'line-through text-gray-400 dark:text-gray-500'
                              : 'text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {st.title}
                        </span>
                      </button>

                      <button
                        onClick={() => deleteSubtask(activeTask.id, st.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 p-1 transition-opacity"
                        title="Delete subtask"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Add Subtask Input */}
                <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a new checklist step..."
                    className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                  <Button type="submit" variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </form>
              </div>
            )}

            {/* TAB: Code */}
            {activeTab === 'code' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">
                    Language: {activeTask.programming_language || 'Python'}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-[#0B0D10] p-4 text-xs font-mono text-gray-200 leading-relaxed shadow-inner">
                  <pre className="overflow-x-auto whitespace-pre font-mono">
                    {activeTask.code_snippet ||
                      '# No code snippet attached to this task.\n# Click "AI Actions" to generate sample boilerplate.'}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB: AI Actions */}
            {activeTab === 'ai' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20">
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>CodeFlow AI Assistant</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Trigger autonomous code generation and architecture analysis powered by Groq.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { label: 'Break into subtasks', action: 'subtasks', desc: 'Generate 5 engineering checklist steps' },
                    { label: 'Explain this task', action: 'explain', desc: 'High-level architecture and rationale' },
                    { label: 'Generate test suite', action: 'test', desc: 'Create pytest / vitest unit tests' },
                    { label: 'Find edge cases', action: 'debug', desc: 'Identify security & concurrency pitfalls' },
                  ].map((btn) => (
                    <button
                      key={btn.action}
                      onClick={() => handleRunAiAction(btn.action)}
                      disabled={isAiGenerating}
                      className="p-3 rounded-xl border border-gray-200/80 dark:border-white/10 hover:border-indigo-500/50 hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-all group"
                    >
                      <span className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors block">
                        ✨ {btn.label}
                      </span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">{btn.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Comments */}
            {activeTab === 'comments' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-gray-50/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-start gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face"
                      alt="Elena"
                      className="w-6 h-6 rounded-full object-cover mt-0.5"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">Elena Rostova</span>
                        <span className="text-[10px] text-gray-400 font-mono">2h ago</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Verified the rate limiting headers on the staging endpoint. Ready for QA testing!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (!newComment.trim()) return;
                      addToast({ title: 'Comment Posted', description: 'Your update was added.', type: 'info' });
                      setNewComment('');
                    }}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
