import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useTaskStore } from '../store/taskStore';
import { useCopilotStore } from '../store/copilotStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { Task, Subtask, Comment, ActivityLog, TaskStatus } from '../types';
import {
  ArrowLeft,
  Sparkles,
  Play,
  CheckCircle2,
  Square,
  CheckSquare,
  Plus,
  Trash2,
  ShieldCheck,
  Bug,
  ListTree,
  FileCode,
  Save,
  MessageSquare,
  History,
  Send,
  Clock,
  User,
  Bot,
  Terminal,
  FileText
} from 'lucide-react';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useAuthStore();
  const {
    activeTask,
    loadTaskById,
    updateTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask
  } = useTaskStore();

  const { openModal, openCopilot, sendMessage } = useCopilotStore();

  const [task, setTask] = useState<Task | null>(null);
  const [code, setCode] = useState<string>('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isSavingCode, setIsSavingCode] = useState(false);
  const [codeSavedSuccess, setCodeSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');

  useEffect(() => {
    if (id) {
      const taskId = Number(id);
      loadTaskById(taskId).then((t) => {
        setTask(t);
        setCode(t.code_snippet || '# Write or paste your code snippet here\n');
      });
      api.getComments(taskId).then(setComments).catch(() => {});
      api.getActivityLogs(taskId).then(setActivityLogs).catch(() => {});
    }
  }, [id]);

  if (!task) {
    return (
      <div className="p-8 text-center text-xs text-gray-500 font-mono">
        Loading task specification...
      </div>
    );
  }

  const handleStatusChange = async (newStatus: TaskStatus) => {
    const updated = await updateTask(task.id, { status: newStatus });
    setTask(updated);
  };

  const handleSaveCode = async () => {
    setIsSavingCode(true);
    try {
      const updated = await updateTask(task.id, { code_snippet: code });
      setTask(updated);
      setCodeSavedSuccess(true);
      setTimeout(() => setCodeSavedSuccess(false), 1500);
    } catch (e: any) {
      alert('Failed to save code: ' + e.message);
    } finally {
      setIsSavingCode(false);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const st = await addSubtask(task.id, newSubtaskTitle.trim());
    setTask({ ...task, subtasks: [...task.subtasks, st] });
    setNewSubtaskTitle('');
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const c = await api.addComment(task.id, newComment.trim());
    setComments([c, ...comments]);
    setNewComment('');
  };

  const completedSubtasks = task.subtasks.filter((s) => s.is_completed).length;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden animate-in fade-in duration-150">
      {/* Top Action Header */}
      <div className="h-12 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/kanban')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
              {task.task_number}
            </span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <h1 className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-lg">
              {task.title}
            </h1>
          </div>
        </div>

        {/* Status Dropdown & Copilot Shortcut */}
        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 focus:outline-none uppercase tracking-wider"
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="testing">Testing</option>
            <option value="done">Done</option>
          </select>

          <button
            onClick={() => openCopilot(task.id)}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Specifications & Subtasks (Scrollable) */}
        <div className="w-full lg:w-1/2 border-r border-gray-200 dark:border-gray-800 overflow-y-auto p-5 space-y-6 bg-white dark:bg-gray-900">
          {/* Metadata Card */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-gray-400 block font-mono uppercase">Priority</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase">{task.priority}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block font-mono uppercase">Language</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{task.programming_language || 'Python'}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block font-mono uppercase">Est. Hours</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{task.estimated_hours}h</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block font-mono uppercase">Assignee</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate block">{task.assignee_name || 'Alex Chen'}</span>
            </div>
          </div>

          {/* Description / Requirements */}
          <div>
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Specification & Acceptance Criteria</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/70 text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
              {task.description || 'No detailed technical specification written yet.'}
            </div>
          </div>

          {/* Subtasks Section with AI Decomposition */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <ListTree className="w-3.5 h-3.5 text-indigo-500" />
                <span>Subtasks ({completedSubtasks}/{task.subtasks.length})</span>
              </h3>

              <button
                onClick={() => openModal('subtasks', { task })}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>AI Break Subtasks</span>
              </button>
            </div>

            {/* Subtask checklist */}
            <div className="space-y-2">
              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 dark:border-gray-700/70 bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs transition-colors group"
                >
                  <div
                    onClick={() => toggleSubtask(task.id, st.id, !st.is_completed)}
                    className="flex items-center gap-2.5 flex-1 cursor-pointer"
                  >
                    {st.is_completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <span className={`leading-snug ${st.is_completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                      {st.title}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteSubtask(task.id, st.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-500 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {task.subtasks.length === 0 && (
                <p className="text-xs text-gray-400 italic py-2">
                  No subtasks defined. Click "AI Break Subtasks" to generate with Groq.
                </p>
              )}
            </div>

            {/* Quick add subtask inline */}
            <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add subtask manually..."
                className="flex-1 px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs font-medium disabled:opacity-40"
              >
                Add
              </button>
            </form>
          </div>

          {/* Comments & Activity Log Tabs */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-2 mb-3">
              <button
                onClick={() => setActiveTab('comments')}
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  activeTab === 'comments'
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 pb-1'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comments ({comments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  activeTab === 'activity'
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 pb-1'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Audit Logs</span>
              </button>
            </div>

            {activeTab === 'comments' ? (
              <div className="space-y-3">
                {/* Comments List */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{c.author_name || 'Alex Chen'}</span>
                        <span>{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">{c.content}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No comments yet.</p>
                  )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment or code review note..."
                    className="flex-1 px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800/60 text-[11px]"
                  >
                    <span className="text-gray-700 dark:text-gray-300 font-mono">{log.action}: {log.details}</span>
                    <span className="text-gray-400 text-[10px]">{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Integrated Monaco Code Editor */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#1e1e1e] border-t lg:border-t-0">
          {/* Monaco Editor Toolbar */}
          <div className="h-10 bg-[#252526] px-3 flex items-center justify-between border-b border-[#333333] shrink-0 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-[11px]">snippet.{task.programming_language?.toLowerCase() || 'py'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#333333] text-gray-400 font-mono">
                {task.programming_language || 'python'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal('review', { task: { ...task, code_snippet: code } })}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#333333] hover:bg-[#3e3e42] text-emerald-400 text-[11px] font-medium transition-colors"
                title="Run Automated AI Code Review"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>AI Review</span>
              </button>

              <button
                onClick={() => openModal('debug', { task: { ...task, code_snippet: code } })}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#333333] hover:bg-[#3e3e42] text-rose-400 text-[11px] font-medium transition-colors"
                title="Debug Code with AI"
              >
                <Bug className="w-3 h-3" />
                <span>AI Debug</span>
              </button>

              <button
                onClick={handleSaveCode}
                disabled={isSavingCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-all shadow-xs"
              >
                <Save className="w-3 h-3" />
                <span>{codeSavedSuccess ? 'Saved!' : 'Save Code'}</span>
              </button>
            </div>
          </div>

          {/* Monaco Instance */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={task.programming_language?.toLowerCase() === 'python' ? 'python' : 'typescript'}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>

          {/* Monaco Bottom Status */}
          <div className="h-6 bg-[#007acc] text-white px-3 flex items-center justify-between text-[11px] font-mono shrink-0">
            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span>{task.programming_language || 'Python'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>CodeFlow Monaco IDE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
