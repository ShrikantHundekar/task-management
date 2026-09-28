import React, { useState, useEffect } from 'react';
import { useCopilotStore } from '../store/copilotStore';
import { api } from '../services/api';
import {
  X,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  Copy,
  Check,
  FileCode
} from 'lucide-react';

export const AiReviewModal: React.FC = () => {
  const { activeModal, modalData, closeModal } = useCopilotStore();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const task = modalData?.task;

  useEffect(() => {
    if (activeModal === 'review' && task) {
      runReview();
    }
  }, [activeModal, task]);

  const runReview = async () => {
    if (!task) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.runAiAction({
        action: 'code_review',
        task_id: task.id,
        code_snippet: task.code_snippet,
        programming_language: task.programming_language,
      });
      setReviewResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to complete code review');
    } finally {
      setIsLoading(false);
    }
  };

  if (activeModal !== 'review' || !task) return null;

  const handleCopy = () => {
    if (reviewResult?.content) {
      navigator.clipboard.writeText(reviewResult.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-teal-50/60 dark:from-emerald-950/20 dark:to-teal-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>AI Automated Code Review & Security Audit</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-mono">
                  Static & Semantic
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                Evaluating snippet for: <span className="font-mono text-gray-700 dark:text-gray-300 font-medium">{task.title}</span>
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
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
              <p className="text-xs text-gray-500 font-mono">
                Running static analysis, security checks, and Big-O evaluation via Groq...
              </p>
            </div>
          ) : (
            <>
              {/* Code snippet preview badge */}
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                    Target Code Snippet ({task.programming_language || 'python'})
                  </span>
                  <span className="text-[10px] text-emerald-500 font-medium">Review Complete</span>
                </div>
                <pre className="text-[11px] font-mono p-2 bg-gray-900 text-gray-200 rounded overflow-x-auto max-h-32">
                  {task.code_snippet || '// No code snippet attached'}
                </pre>
              </div>

              {/* Review Report Content */}
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-xs leading-relaxed space-y-3">
                <div className="font-sans whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {reviewResult?.content || 'No review data available.'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={runReview}
            disabled={isLoading}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 font-medium disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Re-run Audit</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
