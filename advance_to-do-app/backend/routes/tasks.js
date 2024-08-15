const express = require('express');
const router = express.Router();
const db = require('../models/Task');

// Get all tasks
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ tasks: rows });
  });
});

// Add a new task
router.post('/', (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  db.run(
    'INSERT INTO tasks (title, description, dueDate, priority) VALUES (?, ?, ?, ?)',
    [title, description, dueDate, priority],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Update a task
router.put('/:id', (req, res) => {
  const { title, description, dueDate, priority, completed } = req.body;
  db.run(
    'UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ?, completed = ? WHERE id = ?',
    [title, description, dueDate, priority, completed, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    }
  );
});

// Delete a task
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', req.params.id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ changes: this.changes });
  });
});

module.exports = router;
