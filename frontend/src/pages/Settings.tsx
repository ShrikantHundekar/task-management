import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  Sparkles,
  Sliders,
  Bell,
  Shield,
  Palette,
  Check,
  Save,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const { theme, toggleTheme, addToast } = useAppStore();

  const [fullName, setFullName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@codeflow.ai');
  const [groqKey, setGroqKey] = useState(() => localStorage.getItem('cf_groq_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [temperature, setTemperature] = useState(0.2);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    if (groqKey) {
      localStorage.setItem('cf_groq_key', groqKey);
    }
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        title: 'Settings Saved',
        description: 'Your developer preferences have been updated.',
        type: 'success',
      });
    }, 400);
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'ai', label: 'AI Settings (Groq)', icon: Sparkles },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Auth', icon: Shield },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 select-none">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Configure developer profile, Groq AI inference parameters, and environment preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Tabs Menu */}
        <div className="w-full md:w-60 space-y-1 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab Content */}
        <div className="flex-1 rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#151A21] p-6 shadow-xs">
          {/* TAB: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-white/5">
                Profile Information
              </h2>

              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Alex Rivera</h3>
                  <p className="text-xs text-gray-400 font-mono">alex.rivera@codeflow.ai</p>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 mt-1 inline-block">
                    Staff Full-Stack Engineer
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 font-mono uppercase mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 font-mono uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI Settings (Groq) */}
          {activeTab === 'ai' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Groq AI Engine Configuration
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    High-speed LPU inference configuration for automated planning and debugging
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                  Groq SDK Active
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 font-mono uppercase mb-1">
                  Inference Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#151A21] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                >
                  <option value="llama-3.3-70b-versatile">
                    llama-3.3-70b-versatile (Recommended · 850 tok/s)
                  </option>
                  <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (Fast · 32k context)</option>
                  <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Ultra Low Latency)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 font-mono uppercase mb-1">
                  Custom Groq API Key (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    placeholder="gsk_****************************************"
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  If left blank, CodeFlow backend automatically proxies requests securely via your environment variables.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Sampling Temperature: {temperature}
                  </span>
                  <span className="text-gray-400">Deterministic (0.0) ↔ Creative (1.0)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          )}

          {/* TAB: Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-white/5">
                Theme & Display
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 font-mono uppercase mb-3">
                  Color Mode
                </label>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <button
                    onClick={() => {
                      if (theme !== 'dark') toggleTheme();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      theme === 'dark'
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5'
                        : 'border-gray-200 dark:border-white/10'
                    }`}
                  >
                    <div className="w-full h-12 rounded-xl bg-[#0B0D10] border border-gray-800 flex items-center justify-center text-xs text-gray-300 font-mono mb-2">
                      Dark #0B0D10
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Dark Mode (Default)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (theme !== 'light') toggleTheme();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      theme === 'light'
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50'
                        : 'border-gray-200 dark:border-white/10'
                    }`}
                  >
                    <div className="w-full h-12 rounded-xl bg-[#F8FAFD] border border-gray-200 flex items-center justify-center text-xs text-gray-700 font-mono mb-2">
                      Light #F8FAFD
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Light Mode</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-5 border-t border-gray-100 dark:border-white/5 flex items-center justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
