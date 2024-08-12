const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database(':memory:');

// Database setup
db.serialize(() => {
    db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, dueDate TEXT, priority TEXT)");
});

app.use(bodyParser.json());

// Endpoint to add a new task
app.post('/tasks', (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    const stmt = db.prepare("INSERT INTO tasks (title, description, dueDate, priority) VALUES (?, ?, ?, ?)");
    stmt.run(title, description, dueDate, priority, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title, description, dueDate, priority });
    });
    stmt.finalize();
});

describe('POST /tasks', () => {
    it('should create a new task', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
                title: 'Test Task',
                description: 'This is a test task',
                dueDate: '2024-12-31',
                priority: 'High'
            })
            .expect('Content-Type', /json/)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Task');
        expect(response.body.description).toBe('This is a test task');
        expect(response.body.dueDate).toBe('2024-12-31');
        expect(response.body.priority).toBe('High');
    });
});
