import React, { useState } from 'react';
import { Sparkles, Copy, Check, Play, RefreshCw, HelpCircle, Code, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface AIResponseCardProps {
  content: string;
  codeBlock?: string;
  codeLanguage?: string;
  onActionClick?: (action: string) => void;
}

export const AIResponseCard: React.FC<AIResponseCardProps> = ({
  content,
  codeBlock,
  codeLanguage = 'python',
  onActionClick,
}) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useAppStore();

  const handleCopy = () => {
    if (!codeBlock) return;
    navigator.clipboard.writeText(codeBlock);
    setCopied(true);
    addToast({ title: 'Code Copied', description: 'Snippet copied to clipboard.', type: 'info' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-white via-white to-indigo-50/20 dark:from-[#151A21] dark:via-[#151A21] dark:to-[#171226]/50 p-4 sm:p-5 shadow-sm space-y-3.5 select-text">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-900 dark:text-white tracking-tight">
            CodeFlow AI
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
            Groq LLaMA-3.3-70B
          </span>
        </div>
      </div>

      {/* Content text */}
      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>

      {/* Code Block if available */}
      {codeBlock && (
        <div className="rounded-xl border border-gray-800 bg-[#0B0D10] overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-gray-800/80 bg-gray-900/60 text-[11px] font-mono text-gray-400">
            <span className="uppercase">{codeLanguage}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-gray-100 overflow-x-auto leading-relaxed">
            {codeBlock}
          </pre>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors font-medium"
        >
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </button>

        <button
          onClick={() => onActionClick && onActionClick('explain')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors font-medium"
        >
          <HelpCircle className="w-3 h-3" />
          <span>Explain</span>
        </button>

        <button
          onClick={() => onActionClick && onActionClick('test')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors font-medium"
        >
          <ShieldCheck className="w-3 h-3" />
          <span>Generate Tests</span>
        </button>

        <button
          onClick={() => onActionClick && onActionClick('improve')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors font-medium"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Improve</span>
        </button>
      </div>
    </div>
  );
};
