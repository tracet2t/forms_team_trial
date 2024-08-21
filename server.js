const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

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

// Ensure the tasks table has the expirationDate column
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            dueDate TEXT,
            priority TEXT,
            completed INTEGER DEFAULT 0,
            expirationDate TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        }
    });

    db.all("PRAGMA table_info(tasks)", (err, columns) => {
        if (err) {
            console.error('Error checking table columns:', err.message);
            return;
        }

        const hasExpirationDate = columns.some(col => col.name === 'expirationDate');

        if (!hasExpirationDate) {
            db.run("ALTER TABLE tasks ADD COLUMN expirationDate TEXT", (err) => {
                if (err) {
                    console.error('Error adding column:', err.message);
                } else {
                    console.log('Column "expirationDate" added successfully.');
                }
            });
        }
    });
});

// Endpoint to add a new task
app.post('/tasks', (req, res) => {
    const { title, description, dueDate, priority, expirationDate } = req.body;

    const stmt = db.prepare("INSERT INTO tasks (title, description, dueDate, priority, expirationDate) VALUES (?, ?, ?, ?, ?)");
    stmt.run(title, description, dueDate, priority, expirationDate, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title, description, dueDate, priority, expirationDate });
    });
    stmt.finalize();
});

// Endpoint to get all tasks with optional filtering, search, and sorting
app.get('/tasks', (req, res) => {
    const { status = 'all', sortBy = 'dueDate', search = '' } = req.query;
    let query = "SELECT * FROM tasks WHERE title LIKE ?";
    const params = [`%${search}%`];

    if (status !== 'all') {
        query += " AND completed = ?";
        params.push(status === 'completed' ? 1 : 0);
    }

    if (sortBy === 'priority') {
        // Custom sorting by priority: High, Medium, Low
        query += ` ORDER BY CASE 
                          WHEN priority = 'high' THEN 1
                          WHEN priority = 'medium' THEN 2
                          WHEN priority = 'low' THEN 3
                      END`;
    } else if (sortBy === 'dueDate') {
        query += " ORDER BY dueDate";
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});



// Endpoint to get a specific task
app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    });
});

// Endpoint to update a task
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, description, dueDate, priority, expirationDate } = req.body;

    const query = `UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ?, expirationDate = ? WHERE id = ?`;
    const params = [title, description, dueDate, priority, expirationDate, taskId];

    db.run(query, params, function(err) {
        if (err) {
            console.error('Error updating task:', err.message);
            return res.status(500).json({ error: 'Failed to update task' });
        }

        res.json({
            id: taskId,
            title,
            description,
            dueDate,
            priority,
            expirationDate
        });
    });
});

// Endpoint to delete a task
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).end();
    });
});

// Endpoint to mark a task as completed
app.patch('/tasks/:id/completed', (req, res) => {
    const id = req.params.id;

    db.run("UPDATE tasks SET completed = 1 WHERE id = ?", [id], function(err) {
        if (err) {
            console.error('Error marking task as complete:', err.message);
            return res.status(500).json({ error: 'Failed to mark task as complete' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ id });
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

// Export the app for testing
module.exports = app;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
