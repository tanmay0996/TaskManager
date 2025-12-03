const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// All task routes require auth
router.use(auth);

// GET /api/tasks - list tasks for logged-in user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    return res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tasks - create task for logged-in user
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.create({
      userId: req.userId,
      title,
      description: description || '',
      status: status || 'pending'
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tasks/:id - update task if owner
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    return res.json(task);
  } catch (err) {
    console.error('Update task error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tasks/:id - delete task if owner
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await task.deleteOne();

    return res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
