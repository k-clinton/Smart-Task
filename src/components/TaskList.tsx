import { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Trash2, Edit2, Save, X } from 'lucide-react';
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
  low: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
  medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
  high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
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
      <div className="flex flex-col gap-4 glass-card p-5 rounded-3xl border-brand-200 dark:border-brand-800/50 shadow-sm animate-fade-in">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-dark-900/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-gray-50/50 dark:bg-dark-900/30 p-3 rounded-2xl">
          <div className="flex-1 space-y-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
              Start Time
            </label>
            <DatePicker
              selected={editStartDate}
              onChange={setEditStartDate}
              showTimeSelect
              dateFormat="MMM d, h:mm aa"
              className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 transition-shadow outline-none"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
              Deadline
            </label>
            <DatePicker
              selected={editDueDate}
              onChange={setEditDueDate}
              showTimeSelect
              dateFormat="MMM d, h:mm aa"
              className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 transition-shadow outline-none"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
              Priority Level
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setEditPriority(editPriority === p ? null : p)}
                  className={`flex-1 flex justify-center items-center py-2 rounded-xl capitalize text-sm transition-all ${editPriority === p
                      ? priorityColors[p]
                      : 'bg-white dark:bg-dark-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-white/10'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl dark:text-gray-300 dark:hover:bg-dark-700 flex items-center gap-2 transition-colors">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 rounded-xl flex items-center gap-2 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-4 glass-card p-5 rounded-3xl transition-all duration-300 group border ${task.completed ? 'opacity-75 bg-gray-50/50 dark:bg-dark-900/30' : 'hover:shadow-md hover:border-gray-300 dark:hover:border-white/20'
      }`}>
      <button
        type="button"
        onClick={() => onToggleTask(task.id, !task.completed)}
        className="mt-1 text-gray-300 dark:text-gray-600 hover:text-brand-500 transition-colors shrink-0"
      >
        {task.completed ? (
          <CheckCircle2 className="w-6 h-6 text-brand-500" />
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <p className={`text-lg font-medium transition-all duration-300 truncate ${task.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
            }`}>
            {task.title}
          </p>
          {task.priority && (
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize tracking-wide shrink-0 ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-dark-900/50 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>Created {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
          </div>
          {task.start_date && (
            <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 px-2.5 py-1 rounded-lg border border-brand-100 dark:border-brand-900/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>Starts {format(new Date(task.start_date), 'MMM d, h:mm a')}</span>
            </div>
          )}
          {task.due_date && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${task.completed
                ? 'bg-gray-100 dark:bg-dark-900/50 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30'
              }`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>Due {format(new Date(task.due_date), 'MMM d, h:mm a')}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:text-brand-400 dark:hover:bg-dark-700 rounded-xl transition-colors"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-dark-700 rounded-xl transition-colors"
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
    <div className="space-y-4 empty:hidden">
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