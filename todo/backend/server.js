const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();
const dbPath = path.join(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath);

app.use(express.json()); // To parse JSON request bodies

const cors = require('cors');
app.use(cors());


// Create table if not exists
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
    const stmt = db.prepare(`INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?)`);
    console.log(req.body);  // Log the incoming data for debugging
    stmt.run(title, description, due_date, priority, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to create task' });
        }
        res.status(201).json({ id: this.lastID, title, description, due_date, priority });
    });
    stmt.finalize();
});

// GET /tasks/:id route to retrieve a specific task by its ID
app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve task' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(row);
    });
});

const server = app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

const closeServer = () => {
    server.close();
    db.close();
};


// PUT /tasks/:id route to edit a task
app.put('/tasks/:id', (req, res) => {
    const { title, description, due_date, priority } = req.body;
    const { id } = req.params;

    const stmt = db.prepare(`UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ? WHERE id = ?`);
    stmt.run(title, description, due_date, priority, id, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to update task' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ id, title, description, due_date, priority });
    });
    stmt.finalize();
});


module.exports = { app, closeServer, db };
