// backend/routes/tasks.js

const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
const db = new sqlite3.Database('./db/tasks.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN NOT NULL DEFAULT 0,
      due_date TEXT,
      priority TEXT
    )`);
  }
});

// Fetch all tasks
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new task
router.post('/', (req, res) => {
  const { title, description, due_date, priority } = req.body;
  db.run(`INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?)`,
    [title, description, due_date, priority], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    });
});

// Update a task
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, due_date, priority, completed } = req.body;
  db.run(`UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, completed = ? WHERE id = ?`,
    [title, description, due_date, priority, completed, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json({ changes: this.changes });
    });
});

// Delete a task
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM tasks WHERE id = ?`, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ changes: this.changes });
  });
});

module.exports = router;
