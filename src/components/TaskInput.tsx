import React, { useState } from 'react';
import { Send, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface TaskInputProps {
  onAddTask: (taskData: {
    title: string;
    completed: boolean;
    start_date: string | null;
    due_date: string | null;
    priority: 'low' | 'medium' | 'high' | null;
  }) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | null>(null);
  const [showDates, setShowDates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        completed: false,
        start_date: startDate?.toISOString() || null,
        due_date: dueDate?.toISOString() || null,
        priority
      });
      setTitle('');
      setStartDate(null);
      setDueDate(null);
      setPriority(null);
      setShowDates(false);
    }
  };

  const priorityColors = {
    low: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
    medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
    high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
  };

  return (
    <div className="glass-card rounded-3xl p-4 w-full relative z-20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 relative z-20">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-dark-900/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowDates(!showDates)}
            className={`px-4 py-3 rounded-2xl transition-all flex items-center justify-center ${showDates
              ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
              : 'text-gray-400 hover:text-brand-500 hover:bg-gray-50 dark:hover:bg-dark-800'
              }`}
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-6 py-3 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-dark-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {showDates && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center animate-fade-in p-2 bg-gray-50/50 dark:bg-dark-900/30 rounded-2xl relative z-50">
            <div className="flex-1 space-y-2">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                Start Time
              </label>
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  showTimeSelect
                  dateFormat="MMM d, h:mm aa"
                  placeholderText="Select start"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 transition-shadow outline-none"
                  popperClassName="z-[100]"
                  popperPlacement="bottom-start"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                Deadline
              </label>
              <div className="relative">
                <DatePicker
                  selected={dueDate}
                  onChange={setDueDate}
                  showTimeSelect
                  dateFormat="MMM d, h:mm aa"
                  placeholderText="Select due date"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 transition-shadow outline-none"
                  popperClassName="z-[100]"
                  popperPlacement="bottom-start"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2 relative z-10">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                Priority Level
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(priority === p ? null : p)}
                    className={`flex-1 flex justify-center items-center py-2 rounded-xl capitalize text-sm transition-all ${priority === p
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
        )}
      </form>
    </div>
  );
}