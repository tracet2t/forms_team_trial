const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(':memory:');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize in-memory database and create tasks table
db.serialize(() => {
    db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT, description TEXT, dueDate TEXT, priority TEXT, completed BOOLEAN, expirationDate TEXT, expirationTime TEXT)");
});

// Routes
app.get('/tasks', (req, res) => {
    db.all("SELECT * FROM tasks", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/tasks', (req, res) => {
    const { title, description, dueDate, priority, expirationDate, expirationTime } = req.body;
    db.run("INSERT INTO tasks (title, description, dueDate, priority, completed, expirationDate, expirationTime) VALUES (?, ?, ?, ?, ?, ?, ?)", 
    [title, description, dueDate, priority, false, expirationDate, expirationTime], 
    function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.put('/tasks/:id', (req, res) => {
    const { title, description, dueDate, priority, expirationDate, expirationTime } = req.body;
    db.run("UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ?, expirationDate = ?, expirationTime = ? WHERE id = ?", 
    [title, description, dueDate, priority, expirationDate, expirationTime, req.params.id], 
    function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updated: this.changes });
    });
});

app.delete('/tasks/:id', (req, res) => {
    db.run("DELETE FROM tasks WHERE id = ?", [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

app.patch('/tasks/:id/completed', (req, res) => {
    db.run("UPDATE tasks SET completed = ? WHERE id = ?", [true, req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ completed: this.changes });
    });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
