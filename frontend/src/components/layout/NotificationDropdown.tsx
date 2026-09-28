import React, { useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Check, CheckCheck, Sparkles, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead } = useAppStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const typeIcons = {
    task: <AlertCircle className="w-3.5 h-3.5 text-blue-500" />,
    comment: <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />,
    ai: <Sparkles className="w-3.5 h-3.5 text-indigo-500" />,
    system: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#151A21] border border-gray-200 dark:border-white/10 shadow-2xl p-4 z-50 text-xs animate-fade-in"
    >
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold">
            {notifications.filter((n) => !n.read).length} new
          </span>
        </div>
        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
        >
          <CheckCheck className="w-3 h-3" />
          Mark all read
        </button>
      </div>

      <div className="mt-2 divide-y divide-gray-100 dark:divide-white/5 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-400">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                onClose();
              }}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer flex items-start gap-3 ${
                !n.read ? 'bg-indigo-50/40 dark:bg-indigo-500/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 shrink-0 mt-0.5">
                {typeIcons[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{n.title}</p>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5 leading-relaxed line-clamp-2">
                  {n.message}
                </p>
                <span className="text-[10px] text-gray-400 font-mono mt-1 inline-block">{n.timestamp}</span>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
