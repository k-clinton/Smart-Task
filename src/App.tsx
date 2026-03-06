import React, { useEffect, useState } from 'react';
import { BrainCog, LogOut, Moon, Sun, Filter } from 'lucide-react';
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
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
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
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .insert([{ 
        ...taskData,
        user_id: user.id 
      }]);

    if (error) {
      console.error('Error adding task:', error);
      return;
    }

    fetchTasks();
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    fetchTasks();
  }

  async function toggleTask(id: string, completed: boolean) {
    await updateTask(id, { completed });
  }

  async function deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return;
    }

    fetchTasks();
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  }

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Auth />
      </div>
    );
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <BrainCog className="w-10 h-10 text-blue-500" />
            <h1 className="text-3xl font-bold">SmartTask</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline-block">
              {user.email}
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <TaskInput onAddTask={addTask} />
          
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${filter === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${filter === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${filter === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              >
                Completed
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 px-4">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>

          <TaskList 
            tasks={filteredTasks} 
            onToggleTask={toggleTask} 
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
