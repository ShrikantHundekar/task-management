import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import { Task, TaskStatus } from '../../types';

interface KanbanBoardProps {
  tasks: Task[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'backlog', title: 'Backlog', color: '#94A3B8' },
    { id: 'todo', title: 'To Do', color: '#6366F1' },
    { id: 'in_progress', title: 'In Progress', color: '#3B82F6' },
    { id: 'in_review', title: 'In Review', color: '#F59E0B' },
    { id: 'testing', title: 'Testing', color: '#8B5CF6' },
    { id: 'done', title: 'Done', color: '#10B981' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start h-[calc(100vh-210px)] select-none">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={colTasks}
            accentColor={col.color}
          />
        );
      })}
    </div>
  );
};
