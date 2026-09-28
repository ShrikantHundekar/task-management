import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, Sparkles, Keyboard, LogOut, Moon, Sun, Shield } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { authService } from '../../services/authService';

interface ProfileDropdownProps {
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme, setCommandPaletteOpen, addToast } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleLogout = () => {
    authService.logout();
    addToast({ title: 'Logged Out', description: 'Session ended successfully.', type: 'info' });
    onClose();
    navigate('/login');
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#151A21] border border-gray-200 dark:border-white/10 shadow-2xl p-2 z-50 text-xs animate-fade-in divide-y divide-gray-100 dark:divide-white/5"
    >
      {/* Header Info */}
      <div className="px-3 py-2.5">
        <p className="font-semibold text-sm text-gray-900 dark:text-white">Alex Rivera</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">alex.rivera@codeflow.ai</p>
        <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Pro Plan · Groq Ultra Fast
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        <Link
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          <User className="w-4 h-4 text-gray-400" />
          <span>Profile & Account</span>
        </Link>

        <Link
          to="/settings?tab=ai"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>AI Settings (Groq API)</span>
        </Link>

        <button
          onClick={() => {
            onClose();
            setCommandPaletteOpen(true);
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-4 h-4 text-gray-400" />
            <span>Keyboard Shortcuts</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-white/10 text-gray-500">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => {
            toggleTheme();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
          </div>
        </button>
      </div>

      {/* Logout */}
      <div className="pt-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
