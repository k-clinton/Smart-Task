import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Flag, Trash2, Edit2, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

function TaskItem({
  task,
  onToggleTask,
  onDeleteTask,
  onUpdateTask
}: {
  task: Task,
  onToggleTask: (id: string, completed: boolean) => void,
  onDeleteTask: (id: string) => void,
  onUpdateTask: (id: string, updates: Partial<Task>) => void
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editStartDate, setEditStartDate] = useState<Date | null>(task.start_date ? new Date(task.start_date) : null);
  const [editDueDate, setEditDueDate] = useState<Date | null>(task.due_date ? new Date(task.due_date) : null);

  const handleSave = () => {
    onUpdateTask(task.id, {
      title: editTitle,
      priority: editPriority,
      start_date: editStartDate?.toISOString() || null,
      due_date: editDueDate?.toISOString() || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditStartDate(task.start_date ? new Date(task.start_date) : null);
    setEditDueDate(task.due_date ? new Date(task.due_date) : null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <DatePicker
              selected={editStartDate}
              onChange={setEditStartDate}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <DatePicker
              selected={editDueDate}
              onChange={setEditDueDate}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setEditPriority(p)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md capitalize ${editPriority === p ? priorityColors[p] : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                >
                  <Flag className={`w-4 h-4 ${editPriority === p ? '' : 'text-gray-500 dark:text-gray-400'}`} />
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={handleCancel} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-1">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button onClick={handleSave} className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md flex items-center gap-1">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
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
          <p className={`text-lg transition-all duration-300 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400 opacity-60' : 'text-gray-900 dark:text-gray-100'}`}>
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
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function TaskList({ tasks, onToggleTask, onDeleteTask, onUpdateTask }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onUpdateTask={onUpdateTask}
        />
      ))}
    </div>
  );
}