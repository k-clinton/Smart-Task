import React from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Flag } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  start_date: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high' | null;
  created_at: string;
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string, completed: boolean) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export function TaskList({ tasks, onToggleTask }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => onToggleTask(task.id, !task.completed)}
            className="mt-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <p className={`text-lg ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {task.title}
              </p>
              {task.priority && (
                <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Created: {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
              </div>
              {task.start_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Starts: {format(new Date(task.start_date), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span>Due: {format(new Date(task.due_date), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}