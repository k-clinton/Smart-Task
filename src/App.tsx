import React, { useEffect, useState } from 'react';
import { BrainCog, LogOut, Moon, Sun, Search, ListFilter } from 'lucide-react';
import { TaskList } from './components/TaskList';
import { TaskInput } from './components/TaskInput';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  start_date: string | null;
  priority: 'low' | 'medium' | 'high' | null;
  created_at: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  // Filter & Search & Sort states
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'due_date' | 'priority'>('created_at');
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getCurrentUser();
    fetchTasks();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user.id) {
        fetchTasks();
      } else {
        setTasks([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }

    setTasks(data || []);
  }

  async function addTask(taskData: Omit<Task, 'id' | 'created_at'>) {
    if (!user?.id) return;
    const { error } = await supabase.from('tasks').insert([{ ...taskData, user_id: user.id }]);
    if (error) { console.error('Error adding task:', error); return; }
    fetchTasks();
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (error) { console.error('Error updating task:', error); return; }
    fetchTasks();
  }

  async function toggleTask(id: string, completed: boolean) {
    await updateTask(id, { completed });
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) { console.error('Error deleting task:', error); return; }
    fetchTasks();
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  }

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Auth />
      </div>
    );
  }

  let processedTasks = tasks;

  // 1. Search filter
  if (searchQuery.trim()) {
    processedTasks = processedTasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 2. Tab filter
  processedTasks = processedTasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  // 3. Sorting
  processedTasks = [...processedTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const pWeights = { high: 3, medium: 2, low: 1, null: 0 };
      const aWeight = a.priority ? pWeights[a.priority] : 0;
      const bWeight = b.priority ? pWeights[b.priority] : 0;
      if (bWeight !== aWeight) return bWeight - aWeight; // Descending priority
    }
    if (sortBy === 'due_date') {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime(); // Ascending date
    }
    // Default created_at (descending)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Premium Glass Header */}
      <header className="sticky top-0 z-10 glass border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl">
              <BrainCog className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
              SmartTask
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:inline-block bg-gray-100 dark:bg-dark-800 px-3 py-1.5 rounded-full">
              {user.email}
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-800 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in">
        {/* Animated task input form */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <TaskInput onAddTask={addTask} />
        </section>

        {/* Toolbar: Search, Filter, Sort */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-2 rounded-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
          
          <div className="flex bg-gray-100/50 dark:bg-dark-900/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-5 py-2 rounded-lg transition-all duration-200 text-sm font-medium capitalize ${
                  filter === f
                    ? 'bg-white dark:bg-dark-800 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-dark-800/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-dark-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 transition-shadow appearance-none"
              />
            </div>
            
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none pl-9 pr-8 py-2 bg-gray-50 dark:bg-dark-900 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 transition-shadow text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                <option value="created_at">Latest First</option>
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
              </select>
              <ListFilter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Task List Section */}
        <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {processedTasks.length === 0 ? (
            <div className="text-center py-20 px-4 glass-card rounded-3xl border-dashed border-2">
              <div className="bg-brand-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-brand-900/20">
                <BrainCog className="w-10 h-10 text-brand-500 opacity-80" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {searchQuery ? "No matching tasks found" : "You're all caught up!"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {searchQuery 
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Add some new tasks above to get started with your day."}
              </p>
            </div>
          ) : (
            <div className="mb-4 flex items-center justify-between px-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <span>Showing {processedTasks.length} {processedTasks.length === 1 ? 'task' : 'tasks'}</span>
            </div>
          )}

          <TaskList 
            tasks={processedTasks} 
            onToggleTask={toggleTask} 
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
