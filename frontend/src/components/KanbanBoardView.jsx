import React from 'react';
import { Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import KanbanCard from './KanbanCard';

export default function KanbanBoardView({ onEditTask, onDecomposeTask, onAddNewToColumn }) {
  const { tasks } = useTasks();

  const columns = [
    { id: 'backlog', title: 'To Do', color: 'var(--cat-todo)', countId: 'backlog' },
    { id: 'in_dev', title: 'In Progres', color: 'var(--cat-inprog)', countId: 'in_dev' },
    { id: 'code_review', title: 'Review', color: 'var(--cat-review)', countId: 'code_review' },
    { id: 'done', title: 'Complete', color: 'var(--cat-done)', countId: 'done' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '20px',
      alignItems: 'start'
    }}>
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);

        return (
          <div
            key={col.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              minWidth: 0
            }}
          >
            {/* Column Header matching Screenshot 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: col.color,
                  display: 'inline-block'
                }} />
                <h3 style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {col.title}
                </h3>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Plus Button */}
              <button
                onClick={() => onAddNewToColumn(col.id)}
                title={`Add task to ${col.title}`}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease'
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Tasks in Column */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              minHeight: '150px'
            }}>
              {colTasks.map(task => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDecompose={onDecomposeTask}
                />
              ))}

              {colTasks.length === 0 && (
                <div style={{
                  border: '1.5px dashed var(--border-light)',
                  borderRadius: '14px',
                  padding: '24px 12px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '12px'
                }}>
                  No tasks in {col.title}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
