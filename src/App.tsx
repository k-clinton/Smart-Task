import React, { useEffect, useState } from 'react';
import { BrainCog, LogOut, Moon, Sun } from 'lucide-react';
import { TaskList } from './components/TaskList';
import { TaskInput } from './components/TaskInput';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';

interface Task {
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
  const [userId, setUserId] = useState<string | null>(null);
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
      setUserId(user?.id || null);
    };

    getCurrentUser();
    fetchTasks();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id || null);
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
    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .insert([{ 
        ...taskData,
        user_id: userId 
      }]);

    if (error) {
      console.error('Error adding task:', error);
      return;
    }

    fetchTasks();
  }

  async function toggleTask(id: string, completed: boolean) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
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

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BrainCog className="w-10 h-10 text-blue-500" />
            <h1 className="text-3xl font-bold">SmartTask</h1>
          </div>
          <div className="flex items-center gap-4">
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
          <TaskList tasks={tasks} onToggleTask={toggleTask} />
        </div>
      </div>
    </div>
  );
}

export default App;