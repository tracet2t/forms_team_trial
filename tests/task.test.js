const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// In-memory database setup for testing
const db = new sqlite3.Database(':memory:');

// Create the table if it does not exist
db.serialize(() => {
    db.run(`
        CREATE TABLE tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            dueDate TEXT,
            priority TEXT
        )
    `);
});

app.use(express.static('public'));

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

// Test cases
describe('Task API', () => {
    let createdTaskId;

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

        createdTaskId = response.body.id;
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Task');
        expect(response.body.description).toBe('This is a test task');
        expect(response.body.dueDate).toBe('2024-12-31');
        expect(response.body.priority).toBe('High');
    });

    it('should get all tasks', async () => {
        const response = await request(app)
            .get('/tasks')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: createdTaskId,
                title: 'Test Task',
                description: 'This is a test task',
                dueDate: '2024-12-31',
                priority: 'High'
            })
        ]));
    });

    it('should update a task', async () => {
        const response = await request(app)
            .put(`/tasks/${createdTaskId}`)
            .send({
                title: 'Updated Task',
                description: 'This task has been updated',
                dueDate: '2025-01-01',
                priority: 'Medium'
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.title).toBe('Updated Task');
        expect(response.body.description).toBe('This task has been updated');
        expect(response.body.dueDate).toBe('2025-01-01');
        expect(response.body.priority).toBe('Medium');
    });

    it('should mark a task as completed', async () => {
        await request(app)
            .patch(`/tasks/${createdTaskId}/completed`)
            .expect(200);

        const response = await request(app)
            .get(`/tasks/${createdTaskId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.completed).toBe(1);
    });

    it('should delete a task', async () => {
        await request(app)
            .delete(`/tasks/${createdTaskId}`)
            .expect(204);

        await request(app)
            .get(`/tasks/${createdTaskId}`)
            .expect(404);
    });
});
