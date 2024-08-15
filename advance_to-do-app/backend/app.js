const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./tasks.db', (err) => {
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
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Fetch a single task by ID
app.get('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
    const { title, description, due_date, priority } = req.body;
    db.run(
      `INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?)`,
      [title, description, due_date, priority],
      function (err) {
        if (err) {
          console.error('Error inserting task:', err.message);
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(201).json({ id: this.lastID });
      }
    );
  });
  

// Update a task
app.put('/api/tasks/:id', (req, res) => {
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
app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM tasks WHERE id = ?`, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ changes: this.changes });
  });
});

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
