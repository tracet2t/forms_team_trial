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
    console.log('Priority:', priority); // Debugging line
    stmt.run(title, description, due_date, priority, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to create task' });
        }
        res.status(201).json({ id: this.lastID, title, description, due_date, priority });
    });
    stmt.finalize();
});

// routes (GET /tasks)
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve tasks' });
        }
        res.status(200).json(rows);
    });
});

const server = app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

const closeServer = () => {
    server.close();
    db.close();
};

module.exports = { app, closeServer, db };
