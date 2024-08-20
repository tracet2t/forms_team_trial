const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, closeServer, db } = require('../server'); 
const dbPath = path.join(__dirname, '..', 'tasks.db');

// Before all tests, ensure the database is created
beforeAll((done) => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      priority TEXT
    )`, done);
  });
});

// Clean up database before each test
beforeEach((done) => {
  db.run('DELETE FROM tasks', done);
});

// After all tests, close the server and clean up the database file
afterAll(() => {
  closeServer();
  // Ensure the file is removed only if it exists
  if (fs.existsSync(dbPath)) {
    try {
      fs.unlinkSync(dbPath); // Remove the test database file
    } catch (err) {
      console.error('Error removing test database file:', err);
    }
  }
});

// POST test
describe('POST /tasks', () => {
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'New Task',
        description: 'Task description',
        due_date: '2024-12-31',
        priority: 'High'
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('New Task');
    expect(response.body.description).toBe('Task description');
    expect(response.body.due_date).toBe('2024-12-31');
    expect(response.body.priority).toBe('High');
  });
});

// Additional test for GET /tasks
describe('GET /tasks', () => {
  beforeEach((done) => {
    db.run(
      `INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?)`,
      ['Existing Task', 'Existing description', '2024-12-31', 'Medium'],
      done
    );
  });

  it('should retrieve all tasks', async () => {
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); // Adjust based on your setup
    expect(response.body[0].title).toBe('Existing Task');
  });
});

// Additional test for PUT /tasks/:id
describe('PUT /tasks/:id', () => {
  let taskId;

  // Create a task before running the test
  beforeEach((done) => {
    db.run(
      `INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?)`,
      ['Initial Task', 'Initial description', '2024-12-31', 'Medium'],
      function (err) {
        if (err) return done(err);
        taskId = this.lastID;
        done();
      }
    );
  });

  it('should update the task with new data', async () => {
    const updatedTask = {
      title: 'Updated Task',
      description: 'Updated description',
      due_date: '2024-11-30',
      priority: 'High'
    };

    const response = await request(app)
      .put(`/tasks/${taskId}`)
      .send(updatedTask);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Task');
    expect(response.body.description).toBe('Updated description');
    expect(response.body.due_date).toBe('2024-11-30');
    expect(response.body.priority).toBe('High');
  });
});
