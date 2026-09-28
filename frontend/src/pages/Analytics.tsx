import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsSummary } from '../types';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { INITIAL_ANALYTICS } from '../services/mockData';
import { BarChart3, Download, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';

export const AnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary>(INITIAL_ANALYTICS);
  const { openCopilot } = useAppStore();

  useEffect(() => {
    analyticsService.getSummary().then((res) => {
      setSummary(res);
    });
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Productivity & Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Engineering throughput, lead times, and AI acceleration metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ai"
            size="sm"
            onClick={() =>
              openCopilot({
                prompt: 'Analyze our sprint velocity report and suggest 3 high-impact efficiency improvements.',
              })
            }
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            AI Velocity Insights
          </Button>
        </div>
      </div>

      {/* Main Dashboard Widget */}
      <AnalyticsDashboard summary={summary} />
    </div>
  );
};
