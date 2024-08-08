const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./mydb.sqlite');

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Initialize the database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    dueDate TEXT,
    priority TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created successfully');
    }
  });
});

// Get all todos
app.get('/api/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      console.error('Error fetching todos:', err.message);
      res.status(500).send('Error fetching todos');
    } else {
      res.json(rows);
    }
  });
});

// Add a new todo
app.post('/api/todos', (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title) {
    return res.status(400).send('Title is required');
  }

  db.run(
    'INSERT INTO todos (title, description, dueDate, priority) VALUES (?, ?, ?, ?)',
    [title, description, dueDate, priority],
    function (err) {
      if (err) {
        console.error('Error adding todo:', err.message);
        res.status(500).send('Error adding todo');
      } else {
        res.json({ id: this.lastID, title, description, dueDate, priority });
      }
    }
  );
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM todos WHERE id = ?', id, function (err) {
    if (err) {
      console.error('Error deleting todo:', err.message);
      res.status(500).send('Error deleting todo');
    } else {
      res.status(204).send();
    }
  });
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
