const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./mydatabase.sqlite');

app.use(bodyParser.json());
app.use(cors());

// Initialize the database
db.serialize(() => {
  db.run('CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)');
});

// Get all todos
app.get('/api/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

// Add a new todo
app.post('/api/todos', (req, res) => {
  const text = req.body.text;
  db.run('INSERT INTO todos (text) VALUES (?)', text, function (err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id: this.lastID, text });
    }
  });
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM todos WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(204).send();
    }
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
