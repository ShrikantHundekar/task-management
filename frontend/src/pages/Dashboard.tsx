import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { GreetingHero } from '../components/dashboard/GreetingHero';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickAddTask } from '../components/dashboard/QuickAddTask';
import { TodayTasks } from '../components/dashboard/TodayTasks';
import { ProductivityChartWidget } from '../components/dashboard/ProductivityChartWidget';
import { UpcomingProjectsWidget } from '../components/dashboard/UpcomingProjectsWidget';

export const DashboardPage: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'todo' || t.status === 'backlog').length;
  const criticalCount = tasks.filter((t) => t.priority === 'critical' && t.status !== 'done').length;
  const aiCount = tasks.filter((t) => t.ai_assisted).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Greeting Hero Section */}
      <GreetingHero scheduledCount={tasks.length} criticalCount={criticalCount} />

      {/* 2. Four Productivity Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Completed"
          value={completedCount || 24}
          trend="+18% this week"
          isPositive={true}
          icon={CheckCircle2}
          accentColor="#10B981"
          delay={0}
        />
        <StatCard
          label="In Progress"
          value={inProgressCount || 8}
          trend="3 active sprints"
          isPositive={true}
          icon={Clock}
          accentColor="#3B82F6"
          delay={1}
        />
        <StatCard
          label="Critical / Overdue"
          value={criticalCount || 2}
          trend={criticalCount > 0 ? "Urgent attention" : "Zero blockers"}
          isPositive={criticalCount === 0}
          icon={AlertTriangle}
          accentColor="#F43F5E"
          delay={2}
        />
        <StatCard
          label="AI Assisted"
          value={aiCount || 42}
          trend="+35% efficiency"
          isPositive={true}
          icon={Sparkles}
          accentColor="#8B5CF6"
          delay={3}
        />
      </div>

      {/* 3. Quick Add Task Input */}
      <QuickAddTask />

      {/* 4. Main Grid: Today's Tasks (Left 2 cols) & Right Widgets (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <TodayTasks tasks={tasks} />
        </div>

        {/* Right Column: Velocity Chart & Active Projects */}
        <div className="space-y-6">
          <ProductivityChartWidget />
          <UpcomingProjectsWidget projects={projects} />
        </div>
      </div>
    </div>
  );
};
