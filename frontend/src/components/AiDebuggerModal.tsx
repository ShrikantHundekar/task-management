import React, { useState } from 'react';
import { useCopilotStore } from '../store/copilotStore';
import { useTaskStore } from '../store/taskStore';
import { api } from '../services/api';
import {
  X,
  Bug,
  Sparkles,
  Play,
  Copy,
  Check,
  ArrowRight,
  Terminal,
  FileCode
} from 'lucide-react';

export const AiDebuggerModal: React.FC = () => {
  const { activeModal, modalData, closeModal } = useCopilotStore();
  const { updateTask } = useTaskStore();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const task = modalData?.task;

  if (activeModal !== 'debug' || !task) return null;

  const handleRunDebug = async () => {
    setIsLoading(true);
    setApplied(false);
    try {
      const res = await api.runAiAction({
        action: 'debug_code',
        task_id: task.id,
        code_snippet: task.code_snippet,
        programming_language: task.programming_language,
        error_message: errorMessage || 'Traceback: Index out of range or Unhandled Exception',
      });
      setDebugResult(res);
    } catch (err: any) {
      alert(err.message || 'Debug failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (debugResult?.content) {
      navigator.clipboard.writeText(debugResult.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-rose-50/50 to-orange-50/50 dark:from-rose-950/20 dark:to-orange-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>AI Root-Cause Debugger & Auto-Patch</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-mono">
                  Stack Trace Engine
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                Debugging task: <span className="font-mono text-gray-700 dark:text-gray-300 font-medium">{task.task_number}</span> - {task.title}
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

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Stack trace input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-rose-500" />
                Error Log / Stack Trace / Failed Test Output:
              </span>
              <span className="text-[10px] text-gray-400 font-normal">Optional if analyzing snippet only</span>
            </label>
            <textarea
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="Paste terminal error logs or stack trace here (e.g. TypeError: 'NoneType' object has no attribute 'get')..."
              rows={3}
              className="w-full p-2.5 text-xs font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Current Code Snippet preview */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                Attached Snippet ({task.programming_language || 'python'})
              </span>
            </div>
            <pre className="text-[11px] font-mono p-2.5 bg-gray-900 text-gray-200 rounded-lg overflow-x-auto max-h-36">
              {task.code_snippet || '// No code snippet attached'}
            </pre>
          </div>

          {/* Diagnosis Result */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
              <p className="text-xs text-gray-500 font-mono">
                Tracing callstack and analyzing edge conditions in Groq...
              </p>
            </div>
          )}

          {debugResult && !isLoading && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60">
                <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5" />
                  <span>RCA & Suggested Fix:</span>
                </div>
                <div className="text-xs font-sans whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                  {debugResult.content}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={handleRunDebug}
            disabled={isLoading}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Diagnose & Fix</span>
          </button>

          <div className="flex items-center gap-2">
            {debugResult && (
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Solution'}</span>
              </button>
            )}
            <button
              onClick={closeModal}
              className="px-4 py-1.5 text-xs font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
