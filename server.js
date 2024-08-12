const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the table if it does not exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            dueDate TEXT,
            priority TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        }
    });
});

// Endpoint to add a new task
app.post('/tasks', (req, res) => {
    const { title, description, dueDate, priority } = req.body;

    const stmt = db.prepare("INSERT INTO tasks (title, description, dueDate, priority) VALUES (?, ?, ?, ?)");
    stmt.run(title, description, dueDate, priority, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title, description, dueDate, priority });
    });
    stmt.finalize();
});

// Endpoint to get all tasks
app.get('/tasks', (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Gracefully shut down and close database
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
