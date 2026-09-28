export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'testing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  color: string;
  role: string;
  projectsCount: number;
}

export interface Project {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  programming_language?: string;
  framework?: string;
  repository_url?: string;
  status: 'active' | 'archived' | 'completed' | 'on_hold';
  created_at: string;
  updated_at?: string;
  tasks_count: number;
  completed_tasks_count: number;
  is_favorite?: boolean;
  members_count?: number;
}

export interface Subtask {
  id: number;
  task_id: number;
  title: string;
  is_completed: boolean;
  order: number;
  created_at?: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  author_name?: string;
  author_avatar?: string;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  task_id: number;
  user_id: number;
  action: string;
  details?: string;
  created_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  project_name?: string;
  task_number: string;
  title: string;
  description?: string;
  acceptance_criteria?: string[];
  status: TaskStatus;
  priority: TaskPriority;
  programming_language?: string;
  framework?: string;
  code_snippet?: string;
  assignee_name?: string;
  assignee_avatar?: string;
  estimated_hours: number;
  actual_hours: number;
  due_date?: string;
  created_at: string;
  updated_at?: string;
  subtasks: Subtask[];
  labels: Label[];
  comments_count: number;
  ai_assisted?: boolean;
}

export interface AIMessage {
  id?: number | string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  action_type?: string;
  created_at?: string;
  code_block?: string;
  code_language?: string;
  thinking?: boolean;
}

export interface AIConversation {
  id: string;
  title: string;
  taskId?: number;
  lastMessage: string;
  timestamp: string;
  messages: AIMessage[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'ai' | 'comment' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AnalyticsSummary {
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  avg_completion_hours: number;
  total_estimated_hours: number;
  total_actual_hours: number;
  ai_assisted_count: number;
  tasks_by_status: Record<TaskStatus, number>;
  tasks_by_priority: Record<TaskPriority, number>;
  weekly_completion: { day: string; completed: number; created: number }[];
  ai_productivity_trend: { week: string; manualHours: number; savedHours: number }[];
}
