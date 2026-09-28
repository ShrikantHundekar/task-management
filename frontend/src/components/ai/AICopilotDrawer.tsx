import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Send,
  Terminal,
  RotateCcw,
  Zap,
  Code2,
  Check,
  HelpCircle,
  Bug,
  Cpu,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AIResponseCard } from './AIResponseCard';
import { aiService } from '../../services/aiService';
import { AIMessage } from '../../types';

export const AICopilotDrawer: React.FC = () => {
  const { copilotOpen, closeCopilot, copilotContext } = useAppStore();

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am **CodeFlow AI**, your Groq-powered engineering partner.\nAsk me to review code, debug tricky race conditions, architect database schemas, or generate full test suites.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set initial prompt if context was provided
  useEffect(() => {
    if (copilotContext?.prompt && copilotOpen) {
      setInput(copilotContext.prompt);
    }
  }, [copilotContext, copilotOpen]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, isThinking]);

  if (!copilotOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: AIMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    setStreamingContent('');

    try {
      await aiService.chatStream(
        textToSend,
        (chunk) => {
          setStreamingContent(chunk);
        },
        (fullText, codeBlock, codeLang) => {
          setIsThinking(false);
          setStreamingContent('');
          setMessages((prev) => [
            ...prev,
            {
              id: 'ai-' + Date.now(),
              role: 'assistant',
              content: fullText,
              code_block: codeBlock,
              code_language: codeLang,
            },
          ]);
        },
        {
          codeSnippet: copilotContext?.codeSnippet,
        }
      );
    } catch {
      setIsThinking(false);
      setStreamingContent('');
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          role: 'assistant',
          content: 'Sorry, I encountered an error communicating with the inference engine.',
        },
      ]);
    }
  };

  const slashCommands = [
    { cmd: '/debug', desc: 'Find bugs & edge cases', icon: Bug },
    { cmd: '/plan', desc: 'Deconstruct into subtasks', icon: Terminal },
    { cmd: '/test', desc: 'Generate test assertions', icon: Check },
    { cmd: '/explain', desc: 'Explain architecture', icon: HelpCircle },
    { cmd: '/optimize', desc: 'Improve complexity', icon: Cpu },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={closeCopilot}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Sliding AI Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-white dark:bg-[#11151A] border-l border-gray-200 dark:border-white/10 shadow-2xl flex flex-col h-full z-10 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200/80 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">CodeFlow Copilot</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-mono">Groq LLaMA-3.3-70B · 850 tokens/sec</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome',
                      role: 'assistant',
                      content: 'Chat refreshed. Ready for your next query.',
                    },
                  ])
                }
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={closeCopilot}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Slash Commands Pills */}
          <div className="px-4 py-2 border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto text-xs">
            {slashCommands.map((sc) => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.cmd}
                  onClick={() => handleSend(`${sc.cmd} `)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200/80 dark:border-white/10 hover:border-indigo-500 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-mono text-[11px] shrink-0 transition-all"
                >
                  <Icon className="w-3 h-3 text-indigo-500" />
                  <span className="font-semibold">{sc.cmd}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 bg-indigo-600 text-white text-xs sm:text-sm font-medium shadow-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <AIResponseCard
                    content={msg.content}
                    codeBlock={msg.code_block}
                    codeLanguage={msg.code_language}
                    onActionClick={(action) => handleSend(`/${action}`)}
                  />
                )}
              </div>
            ))}

            {/* Live Streaming Response Indicator */}
            {isThinking && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-500">
                  <Zap className="w-3.5 h-3.5 animate-bounce" />
                  <span>CodeFlow AI is thinking...</span>
                </div>
                {streamingContent && (
                  <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-500/5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-mono whitespace-pre-wrap animate-pulse">
                    {streamingContent}
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-4 border-t border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#11151A]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your code... (/debug, /plan, /test)"
                className="w-full pr-12 pl-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/5 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="absolute right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
