import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import {
  Key,
  Cpu,
  Check,
  Zap,
  Save,
  ShieldAlert,
  Server,
  Terminal,
  ExternalLink,
  User,
  Moon,
  Sun
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { groqKey, setGroqKey, groqModel, setGroqModel, theme, toggleTheme, user } = useAuthStore();
  const [apiKeyInput, setApiKeyInput] = useState(groqKey);
  const [selectedModel, setSelectedModel] = useState(groqModel);
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGroqKey(apiKeyInput.trim());
    setGroqModel(selectedModel);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const start = performance.now();
    try {
      const res = await api.runAiAction({
        action: 'explain_task',
        prompt: 'Ping test from CodeFlow AI settings. Respond in 5 words.',
      });
      const duration = Math.round(performance.now() - start);
      setTestResult(`Success! Groq responded in ${duration}ms: "${res.content.slice(0, 60)}"`);
    } catch (err: any) {
      setTestResult(`Connection test notice: ${err.message || 'Check your key'}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          Platform Settings
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure Groq AI reasoning engine, model selection, and developer preferences
        </p>
      </div>

      {/* Groq Cloud Integration Section */}
      <div className="p-5 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold font-mono text-sm">
              G
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Groq Cloud LPUs & Inference API</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono px-2 py-0.2 rounded-full">
                  Sub-Second Speed
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                CodeFlow AI uses Groq to deliver instantaneous task breakdown, code audits, and test generation.
              </p>
            </div>
          </div>

          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Get Groq API Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* API Key input */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-orange-500" />
                Groq API Key (gsk_...)
              </span>
              <span className="text-[10px] text-gray-400 font-normal">Stored locally in your browser session</span>
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
          </div>

          {/* Model selection */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              Inference Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            >
              <option value="llama-3.3-70b-versatile">
                Meta LLaMA 3.3 70B Versatile (Recommended • Deep Coding Reasoning)
              </option>
              <option value="llama-3.1-8b-instant">
                Meta LLaMA 3.1 8B Instant (Ultra Fast • Low Latency)
              </option>
              <option value="mixtral-8x7b-32768">
                Mixtral 8x7B (32k Context Window)
              </option>
            </select>
          </div>

          {/* Test connection output */}
          {testResult && (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-700 dark:text-gray-300">
              {testResult}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isTesting ? 'Pinging Groq...' : 'Test Connection'}</span>
            </button>

            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Settings Saved!' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Developer Profile Section */}
      <div className="p-5 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          <span>Developer Profile</span>
        </h2>

        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'}
            alt="Alex Chen"
            className="w-14 h-14 rounded-full ring-2 ring-indigo-500 object-cover"
          />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{user?.full_name || 'Alex Chen'}</h3>
            <p className="text-xs text-gray-500 font-mono">{user?.email || 'alex@codeflow.io'}</p>
            <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
              Lead Software Architect
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
