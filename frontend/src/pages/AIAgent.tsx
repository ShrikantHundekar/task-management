import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Send,
  MessageSquare,
  Bug,
  Terminal,
  Check,
  HelpCircle,
  Cpu,
  Zap,
  Trash2,
} from 'lucide-react';
import { AIConversation, AIMessage } from '../types';
import { aiService } from '../services/aiService';
import { AIResponseCard } from '../components/ai/AIResponseCard';
import { Button } from '../components/ui/Button';

export const AIAgentPage: React.FC = () => {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    aiService.getConversations().then((res) => {
      setConversations(res);
      if (res.length > 0) setActiveConvId(res[0].id);
    });
  }, []);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, streamingContent, isThinking]);

  const handleCreateNewThread = () => {
    const newId = 'conv-' + Date.now();
    const newConv: AIConversation = {
      id: newId,
      title: 'New Coding Thread',
      lastMessage: 'Ready for your engineering query.',
      timestamp: 'Just now',
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content:
            'Hello! I am your **CodeFlow AI Agent** powered by Groq. Ask me to design architecture schemas, debug race conditions, or write test suites.',
        },
      ],
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    setActiveConvId(newId);
    aiService.saveConversation(newConv);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isThinking || !activeConv) return;

    const userMsg: AIMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
    };

    const updatedMessages = [...activeConv.messages, userMsg];
    const updatedConv = {
      ...activeConv,
      title: activeConv.title === 'New Coding Thread' ? textToSend.slice(0, 32) : activeConv.title,
      lastMessage: textToSend.slice(0, 48),
      messages: updatedMessages,
    };

    setConversations((prev) => prev.map((c) => (c.id === activeConv.id ? updatedConv : c)));
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
          const finalConv: AIConversation = {
            ...updatedConv,
            messages: [
              ...updatedConv.messages,
              {
                id: 'ai-' + Date.now(),
                role: 'assistant',
                content: fullText,
                code_block: codeBlock,
                code_language: codeLang,
              },
            ],
          };
          setConversations((prev) => prev.map((c) => (c.id === activeConv.id ? finalConv : c)));
          aiService.saveConversation(finalConv);
        }
      );
    } catch {
      setIsThinking(false);
      setStreamingContent('');
    }
  };

  const slashCommands = [
    { cmd: '/debug', desc: 'Find bugs', icon: Bug },
    { cmd: '/plan', desc: 'Subtask plan', icon: Terminal },
    { cmd: '/test', desc: 'Unit tests', icon: Check },
    { cmd: '/explain', desc: 'Explain logic', icon: HelpCircle },
    { cmd: '/optimize', desc: 'Complexity', icon: Cpu },
  ];

  return (
    <div className="flex h-[calc(100vh-60px)] select-none overflow-hidden">
      {/* Sidebar: Conversations */}
      <div className="w-72 lg:w-80 border-r border-gray-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0E1217]/95 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">AI Conversations</h2>
              <span className="text-[10px] text-gray-400 font-mono">Groq LLaMA-3.3-70B</span>
            </div>
          </div>

          <button
            onClick={handleCreateNewThread}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300"
            title="New Thread"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConvId(c.id)}
              className={`w-full text-left p-3 rounded-2xl transition-all block ${
                activeConvId === c.id
                  ? 'bg-indigo-50/90 dark:bg-indigo-500/15 border border-indigo-200/60 dark:border-indigo-500/30'
                  : 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {c.title}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">{c.timestamp}</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {c.lastMessage}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Center */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFD] dark:bg-[#0B0F19]">
        {/* Chat Header */}
        <div className="h-14 border-b border-gray-200/80 dark:border-white/10 px-6 flex items-center justify-between bg-white/80 dark:bg-[#0E1217]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {activeConv?.title || 'Coding Assistant'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
              Groq Ready
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={handleCreateNewThread}
              leftIcon={<Plus className="w-3 h-3" />}
            >
              New Thread
            </Button>
          </div>
        </div>

        {/* Slash Command Bar */}
        <div className="px-6 py-2 border-b border-gray-200/60 dark:border-white/5 bg-white/40 dark:bg-white/[0.01] flex items-center gap-2 overflow-x-auto">
          {slashCommands.map((sc) => {
            const Icon = sc.icon;
            return (
              <button
                key={sc.cmd}
                onClick={() => handleSend(`${sc.cmd} `)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] hover:border-indigo-500 text-gray-700 dark:text-gray-300 text-xs font-mono shrink-0 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-semibold">{sc.cmd}</span>
              </button>
            );
          })}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
          {activeConv?.messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs px-4 py-3 bg-indigo-600 text-white text-xs sm:text-sm font-medium shadow-sm leading-relaxed whitespace-pre-wrap">
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

          {isThinking && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-500">
                <Zap className="w-4 h-4 animate-bounce" />
                <span>CodeFlow AI is compiling response...</span>
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

        {/* Chat Input */}
        <div className="p-4 sm:p-6 border-t border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0E1217]/90 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="max-w-4xl mx-auto relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your architecture or code... (/debug, /plan, /test)"
              className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="absolute right-2.5 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
