// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json()); // To parse JSON request bodies

const dbPath = path.join(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath);

// Ensure the table exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    priority TEXT
  )`);
});

// POST /tasks route
app.post('/tasks', (req, res) => {
  const { title, description, due_date, priority } = req.body;
  db.run(
    `INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?)`,
    [title, description, due_date, priority],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        title,
        description,
        due_date,
        priority,
      });
    }
  );
});

const server = app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

const closeServer = () => {
  server.close();
  db.close(); // Close the database connection
};

module.exports = { app, server, db, closeServer };
