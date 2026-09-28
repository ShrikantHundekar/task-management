import React, { useState, useRef, useEffect } from 'react';
import { useCopilotStore } from '../store/copilotStore';
import { useTaskStore } from '../store/taskStore';
import {
  X,
  Send,
  Bot,
  Sparkles,
  Code2,
  Bug,
  ListTree,
  FileText,
  ShieldCheck,
  Calculator,
  Copy,
  Check,
  Terminal,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AiCopilotDrawer: React.FC = () => {
  const {
    isOpen,
    closeCopilot,
    messages,
    sendMessage,
    isThinking,
    thinkingAction,
    activeTaskId,
    openModal
  } = useCopilotStore();

  const { tasks, activeTask } = useTaskStore();
  const [prompt, setPrompt] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentTask = (activeTaskId ? tasks.find((t) => t.id === activeTaskId) : null) || activeTask;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isThinking) return;
    const text = prompt;
    setPrompt('');
    sendMessage(text, currentTask);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const quickActions = [
    { label: 'Explain Logic', icon: Sparkles, action: 'explain_task' },
    { label: 'Break Subtasks', icon: ListTree, action: 'break_subtasks' },
    { label: 'Implementation Plan', icon: Layers, action: 'implementation_plan' },
    { label: 'Generate Tests', icon: Terminal, action: 'generate_tests' },
    { label: 'Code Review', icon: ShieldCheck, action: 'code_review' },
    { label: 'Debug Code', icon: Bug, action: 'debug_code' },
    { label: 'Docs Generator', icon: FileText, action: 'generate_documentation' },
    { label: 'Estimate Hours', icon: Calculator, action: 'estimate_task' },
  ];

  const triggerQuickAction = (actionKey: string) => {
    if (!currentTask) {
      sendMessage(`Please run ${actionKey.replace('_', ' ')} on general best practices.`);
      return;
    }

    if (actionKey === 'break_subtasks') {
      openModal('subtasks', { task: currentTask });
      return;
    }
    if (actionKey === 'code_review') {
      openModal('review', { task: currentTask });
      return;
    }
    if (actionKey === 'debug_code') {
      openModal('debug', { task: currentTask });
      return;
    }

    // Direct invocation via Copilot chat
    const promptsMap: Record<string, string> = {
      explain_task: `Explain this task in depth: "${currentTask.title}". Outline architecture patterns, dependencies, and pitfalls.`,
      implementation_plan: `Create a step-by-step technical implementation plan with architecture diagram concepts for "${currentTask.title}".`,
      generate_tests: `Write comprehensive unit and integration test fixtures for "${currentTask.title}" and the following code:\n\`\`\`${currentTask.programming_language || 'python'}\n${currentTask.code_snippet || '# Code snippet'}\n\`\`\``,
      generate_documentation: `Generate clean developer documentation, API schema specs, and usage examples for "${currentTask.title}".`,
      estimate_task: `Provide a realistic engineering time and complexity estimation for "${currentTask.title}".`,
    };

    sendMessage(promptsMap[actionKey] || `Help with ${actionKey}`, currentTask);
  };

  return (
    <div className="fixed right-0 top-14 bottom-0 w-full sm:w-[460px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-40 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                CodeFlow Copilot
              </h3>
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                LLaMA 3.3
              </span>
            </div>
            {currentTask ? (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[280px]">
                Target: <span className="text-indigo-600 dark:text-indigo-400 font-mono font-medium">{currentTask.task_number}</span> - {currentTask.title}
              </p>
            ) : (
              <p className="text-[11px] text-gray-500">Global workspace context</p>
            )}
          </div>
        </div>

        <button
          onClick={closeCopilot}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Chips Bar */}
      <div className="p-2 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/30 dark:bg-gray-900/20 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 w-max">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.action}
                onClick={() => triggerQuickAction(item.action)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors shadow-2xs whitespace-nowrap"
              >
                <Icon className="w-3 h-3 text-indigo-500" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg, idx) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={idx}
              className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-6 h-6 rounded-md bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3 leading-relaxed shadow-xs ${
                  isAssistant
                    ? 'bg-gray-50 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700/60'
                    : 'bg-indigo-600 text-white font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs break-words">
                  {msg.content}
                </div>

                {isAssistant && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-between text-[10px] text-gray-400">
                    <span className="font-mono">Groq LLaMA 3.3 70B</span>
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="flex items-center gap-1 hover:text-indigo-500 transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-3 justify-start items-center text-xs text-gray-500 dark:text-gray-400">
            <div className="w-6 h-6 rounded-md bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="animate-pulse">{thinkingAction || 'Generating reasoning trace...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      >
        <div className="relative flex items-center">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder={
              currentTask
                ? `Ask anything about ${currentTask.task_number}...`
                : "Ask CodeFlow AI anything about your code or sprint..."
            }
            rows={2}
            className="w-full resize-none pl-3 pr-10 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isThinking}
            className="absolute right-2.5 bottom-2.5 p-1.5 rounded-md bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-gray-400">
          <span>Shift + Enter for newline</span>
          <span className="font-mono">Enter to run agent</span>
        </div>
      </form>
    </div>
  );
};
