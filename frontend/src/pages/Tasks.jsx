import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api.js';
import TaskItem from '../components/TaskItem.jsx';
import { setTasks, addTask, updateTask, removeTask } from '../store/tasksSlice.js';

export default function Tasks() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await api.get('/tasks');
      dispatch(setTasks(res.data || []));
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
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/tasks', { title, description });
      dispatch(addTask(res.data));
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
      dispatch(updateTask(res.data));
    } catch {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (task) => {
    try {
      await api.delete(`/tasks/${task._id}`);
      dispatch(removeTask(task._id));
    } catch {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded shadow p-4">
        <h1 className="text-xl font-semibold mb-3">Your Tasks</h1>
        <form onSubmit={handleAdd} className="space-y-2 mb-3">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              className="w-full border rounded px-2 py-1 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description (optional)</label>
            <textarea
              className="w-full border rounded px-2 py-1 text-sm"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded px-3 py-1 text-sm"
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>
        <ul className="space-y-2">
          {tasks.map((t) => (
            <TaskItem
              key={t._id}
              task={t}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
          {tasks.length === 0 && (
            <p className="text-xs text-gray-500">No tasks yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
