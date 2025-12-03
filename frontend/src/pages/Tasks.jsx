// Tasks.jsx - Main Component (Standalone Version)
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ListTodo, Sparkles, LogOut, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import api from '../utils/api.js';
import {TaskItem} from '../components/TaskItem.jsx';
// Zod validation schema
const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
});

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const loadTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data || []);
    } catch (err) {
      setError('Failed to load tasks');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Zod validation
    try {
      taskSchema.parse({ title, description });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = {};
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message;
        });
        setFieldErrors(errors);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await api.post('/tasks', { title, description });
      setTasks([...tasks, res.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const res = await api.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? res.data : t));
    } catch {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (task) => {
    try {
      await api.delete(`/tasks/${task._id}`);
      setTasks(tasks.filter(t => t._id !== task._id));
    } catch {
      setError('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 p-4 md:p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
              <ListTodo className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                Your Tasks <Sparkles className="w-6 h-6 text-yellow-300" />
              </h1>
              <p className="text-purple-200 text-sm">Organize your day efficiently</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </motion.div>

        {/* Add Task Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-8 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Add New Task</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-300"
              />
              {fieldErrors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-pink-300 text-sm mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.title}
                </motion.p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description..."
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-300 resize-none"
              />
              {fieldErrors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-pink-300 text-sm mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.description}
                </motion.p>
              )}
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-pink-500/20 border border-pink-500/50 rounded-lg p-3 flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-pink-300 flex-shrink-0 mt-0.5" />
                <p className="text-pink-200 text-sm">{error}</p>
              </motion.div>
            )}
            <motion.button
              type="button"
              onClick={handleAdd}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Task
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-purple-200 text-sm">Pending</p>
            <p className="text-3xl font-bold text-white">{pendingTasks.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-purple-200 text-sm">Completed</p>
            <p className="text-3xl font-bold text-white">{completedTasks.length}</p>
          </div>
        </motion.div>

        {/* Task Lists */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-3">Pending Tasks</h3>
              <ul className="space-y-3">
                <AnimatePresence>
                  {pendingTasks.map(task => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </motion.div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-white mb-3">Completed Tasks</h3>
              <ul className="space-y-3">
                <AnimatePresence>
                  {completedTasks.map(task => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </motion.div>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <ListTodo className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
              <p className="text-purple-200 text-lg">No tasks yet</p>
              <p className="text-purple-300 text-sm">Add your first task to get started!</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}