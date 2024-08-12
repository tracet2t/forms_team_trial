const request = require('supertest'); // Import supertest for API testing
const { app, db } = require('../server'); // Import the app and database from the server

// Setup code to run before any tests
beforeAll((done) => {
  db.serialize(() => {
    // Create the todos table if it doesn't exist
    db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, dueDate TEXT, priority TEXT, expiration TEXT, completed INTEGER DEFAULT 0)', () => {
      // Insert a test todo item
      db.run('INSERT INTO todos (title, description, dueDate, priority, expiration) VALUES (?, ?, ?, ?, ?)', ['Test Todo', 'Test Description', '2024-08-31', 'High', '2024-08-30T23:59:59'], done);
    });
  });
});

// Cleanup code to run after all tests
afterAll((done) => {
  db.serialize(() => {
    // Drop the todos table if it exists
    db.run('DROP TABLE IF EXISTS todos', () => {
      db.close(done); // Close the database connection
    });
  });
});

// Test suite for POST /api/todos
describe('POST /api/todos', () => {
  it('should create a new todo with an expiration date', async () => {
    const newTodo = {
      title: 'Test Task',
      description: 'Test task description',
      dueDate: '2024-08-31',
      priority: 'High',
      expiration: '2024-08-30T23:59:59'
    };

    const response = await request(app)
      .post('/api/todos')
      .send(newTodo);

    // Assert that the response status is 200 and the todo properties are correct
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.description).toBe(newTodo.description);
    expect(response.body.dueDate).toBe(newTodo.dueDate);
    expect(response.body.priority).toBe(newTodo.priority);
    expect(response.body.expiration).toBe(newTodo.expiration);
    expect(response.body.completed).toBe(false); // Default completed status
  });

  it('should return 400 if title is missing', async () => {
    const newTodo = {
      description: 'Missing title',
      dueDate: '2024-08-31',
      priority: 'Medium',
      expiration: '2024-08-30T23:59:59'
    };

    const response = await request(app)
      .post('/api/todos')
      .send(newTodo);

    // Assert that the response status is 400 and the error message is correct
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Title is required');
  });
});

// Test suite for GET /api/todos
describe('GET /api/todos', () => {
  it('should retrieve all todos, including expiration dates', async () => {
    const response = await request(app)
      .get('/api/todos');

    // Assert that the response status is 200 and the response body is an array of todos
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(todo => {
      // Assert that each todo has the expected properties
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('description');
      expect(todo).toHaveProperty('dueDate');
      expect(todo).toHaveProperty('priority');
      expect(todo).toHaveProperty('expiration');
      expect(todo).toHaveProperty('completed');
    });
  });
});

// Test suite for GET /api/todos/:id
describe('GET /api/todos/:id', () => {
  it('should retrieve a single todo by id', async () => {
    const newTodo = {
      title: 'Get Task',
      description: 'Task to be retrieved',
      dueDate: '2024-08-31',
      priority: 'Low',
      expiration: '2024-08-30T23:59:59'
    };

    // Create a new todo and retrieve its ID
    const postResponse = await request(app)
      .post('/api/todos')
      .send(newTodo);

    const { id } = postResponse.body;

    // Retrieve the todo by ID
    const getResponse = await request(app)
      .get(`/api/todos/${id}`);

    // Assert that the response status is 200 and the todo properties are correct
    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body).toHaveProperty('id');
    expect(getResponse.body.title).toBe(newTodo.title);
    expect(getResponse.body.description).toBe(newTodo.description);
    expect(getResponse.body.dueDate).toBe(newTodo.dueDate);
    expect(getResponse.body.priority).toBe(newTodo.priority);
    expect(getResponse.body.expiration).toBe(newTodo.expiration);
    expect(getResponse.body.completed).toBe(false); // Ensure completed is false by default
  });
});

// Test suite for DELETE /api/todos/:id
describe('DELETE /api/todos/:id', () => {
  it('should delete an existing todo', async () => {
    const newTodo = {
      title: 'Delete Task',
      description: 'Task to be deleted',
      dueDate: '2024-08-31',
      priority: 'Low',
      expiration: '2024-08-30T23:59:59'
    };

    // Create a new todo and retrieve its ID
    const postResponse = await request(app)
      .post('/api/todos')
      .send(newTodo);

    const { id } = postResponse.body;

    // Delete the todo by ID
    const deleteResponse = await request(app)
      .delete(`/api/todos/${id}`);

    // Assert that the response status is 204 (No Content)
    expect(deleteResponse.statusCode).toBe(204);
  });

  it('should return 404 if the todo does not exist', async () => {
    const response = await request(app)
      .delete('/api/todos/999');

    // Assert that the response status is 404 and the error message is correct
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('Todo not found');
  });
});

// Test suite for PATCH /api/todos/:id/complete
describe('PATCH /api/todos/:id/complete', () => {
  let originalRun;

  beforeEach(() => {
    // Backup the original db.run method
    originalRun = db.run;
  });

  afterEach(() => {
    // Restore the original db.run method
    db.run = originalRun;
  });

  it('should mark a todo as completed', async () => {
    const newTodo = {
      title: 'Complete Task',
      description: 'Task to be marked as completed',
      dueDate: '2024-08-31',
      priority: 'Medium',
      expiration: '2024-08-30T23:59:59'
    };

    // Create a new todo and retrieve its ID
    const postResponse = await request(app)
      .post('/api/todos')
      .send(newTodo);

    const { id } = postResponse.body;

    // Mark the todo as completed
    const patchResponse = await request(app)
      .patch(`/api/todos/${id}/complete`);

    // Assert that the response status is 200 and the success message is correct
    expect(patchResponse.statusCode).toBe(200);
    expect(patchResponse.text).toBe('Todo marked as completed');

    // Retrieve the updated todo to verify the completion status
    const getResponse = await request(app)
      .get(`/api/todos/${id}`);

    // Assert that the completed status is now true
    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.completed).toBe(true);
  });

  it('should return 404 if the todo does not exist', async () => {
    const response = await request(app)
      .patch('/api/todos/999/complete');

    // Assert that the response status is 404 and the error message is correct
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('Todo not found');
  });

  it('should return 500 if there is an error updating the todo', async () => {
    // Simulate a database error
    db.run = jest.fn((query, params, callback) => callback(new Error('Database error')));

    const response = await request(app)
      .patch('/api/todos/1/complete');

    // Assert that the response status is 500 and the error message is correct
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('Error updating todo');
  });
});
