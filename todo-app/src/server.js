const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Initialize SQLite database
const db = new sqlite3.Database('tasks.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        // Create tasks table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                completed BOOLEAN NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            }
        });
    }
});

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get all tasks
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ tasks: rows });
    });
});

// Endpoint to add a new task
app.post('/tasks', (req, res) => {
    const { text, completed } = req.body;
    db.run(`INSERT INTO tasks (text, completed) VALUES (?, ?)`, [text, completed], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ taskId: this.lastID });
    });
});

// Endpoint to update a task
app.put('/tasks/:id', (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;
    db.run(`UPDATE tasks SET completed = ? WHERE id = ?`, [completed, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Task updated successfully' });
    });
});

// Endpoint to delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM tasks WHERE id = ?`, id, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
