const request = require('supertest'); // Import supertest for API testing
const { app, db } = require('../server'); // Import the app and database from the server
const EventSource = require('eventsource');

beforeAll((done) => {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, dueDate TEXT, priority TEXT, expiration TEXT, completed INTEGER DEFAULT 0)', () => {
      db.run('CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, todoId INTEGER, notifiedAt TEXT)', () => {
        // Insert test data
        db.run('INSERT INTO todos (title, description, dueDate, priority, expiration) VALUES (?, ?, ?, ?, ?)', ['Test Todo 1', 'Test Description 1', '2024-08-31', 'High', '2024-08-30T23:59:59']);
        db.run('INSERT INTO todos (title, description, dueDate, priority, expiration) VALUES (?, ?, ?, ?, ?)', ['Test Todo 2', 'Test Description 2', '2024-09-01', 'Medium', '2024-08-30T23:59:59'], done);
      });
    });
  });
});

afterAll((done) => {
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS todos', () => {
      db.run('DROP TABLE IF EXISTS notifications', () => {
        db.close(done);
      });
    });
  });
});



// Test suite for GET /api/todos with search functionality
describe('GET /api/todos with search', () => {
  it('should return todos that match the search term in title', async () => {
    const response = await request(app)
      .get('/api/todos')
      .query({ search: 'Test Todo 1' });

    // Assert that the response status is 200 and the correct todos are returned
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // Ensure that at least one todo matches the title
    const hasMatchingTodo = response.body.some(todo => 
      todo.title.includes('Test Todo 1')
    );
    expect(hasMatchingTodo).toBe(true);
  });

  it('should return todos that match the search term in description', async () => {
    const response = await request(app)
      .get('/api/todos')
      .query({ search: 'Test Description 2' });

    // Assert that the response status is 200 and the correct todos are returned
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // Ensure that at least one todo matches the description
    const hasMatchingTodo = response.body.some(todo => 
      todo.description.includes('Test Description 2')
    );
    expect(hasMatchingTodo).toBe(true);
  });

  it('should return an empty array if no todos match the search term', async () => {
    const response = await request(app)
      .get('/api/todos')
      .query({ search: 'Nonexistent Todo' });

    // Assert that the response status is 200 and the result is an empty array
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
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

// Test suite for PUT /api/todos/:id
describe('PUT /api/todos/:id', () => {
  let originalRun;

  beforeEach(() => {
    // Backup the original db.run method
    originalRun = db.run;
  });

  afterEach(() => {
    // Restore the original db.run method
    db.run = originalRun;
  });

  it('should update the title, description, due date, expiration date, and priority of a todo', async () => {
    const newTodo = {
      title: 'Initial Task',
      description: 'Initial description',
      dueDate: '2024-08-31',
      priority: 'Low',
      expiration: '2024-08-30T23:59:59'
    };

    // Create a new todo and retrieve its ID
    const postResponse = await request(app)
      .post('/api/todos')
      .send(newTodo);

    const { id } = postResponse.body;

    const updatedTodo = {
      title: 'Updated Task',
      description: 'Updated description',
      dueDate: '2024-09-01',
      priority: 'High',
      expiration: '2024-09-01T23:59:59'
    };

    // Update the todo
    const putResponse = await request(app)
      .put(`/api/todos/${id}`)
      .send(updatedTodo);

    // Assert that the response status is 200 and the success message is correct
    expect(putResponse.statusCode).toBe(200);
    expect(putResponse.text).toBe('Todo updated successfully');

    // Retrieve the updated todo to verify the changes
    const getResponse = await request(app)
      .get(`/api/todos/${id}`);

    // Assert that the todo's properties are updated
    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.title).toBe(updatedTodo.title);
    expect(getResponse.body.description).toBe(updatedTodo.description);
    expect(getResponse.body.dueDate).toBe(updatedTodo.dueDate);
    expect(getResponse.body.priority).toBe(updatedTodo.priority);
    expect(getResponse.body.expiration).toBe(updatedTodo.expiration);
  });

  it('should return 404 if the todo does not exist', async () => {
    const updatedTodo = {
      title: 'Non-existent Task',
      description: 'This task does not exist',
      dueDate: '2024-09-01',
      priority: 'High',
      expiration: '2024-09-01T23:59:59'
    };

    const response = await request(app)
      .put('/api/todos/999')
      .send(updatedTodo);

    // Assert that the response status is 404 and the error message is correct
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('Todo not found');
  });

  it('should return 500 if there is an error updating the todo', async () => {
    const newTodo = {
      title: 'Task with DB Error',
      description: 'This will cause a DB error',
      dueDate: '2024-08-31',
      priority: 'Medium',
      expiration: '2024-08-30T23:59:59'
    };

    // Create a new todo and retrieve its ID
    const postResponse = await request(app)
      .post('/api/todos')
      .send(newTodo);

    const { id } = postResponse.body;

    const updatedTodo = {
      title: 'Updated Task',
      description: 'Updated description',
      dueDate: '2024-09-01',
      priority: 'High',
      expiration: '2024-09-01T23:59:59'
    };

    // Simulate a database error
    db.run = jest.fn((query, params, callback) => callback(new Error('Database error')));

    const response = await request(app)
      .put(`/api/todos/${id}`)
      .send(updatedTodo);

    // Assert that the response status is 500 and the error message is correct
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('Error updating todo');
  });
});


beforeAll((done) => {
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS users', () => {
      db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, password TEXT NOT NULL)', done);
    });
  });
});





// Test suite for POST /api/register
describe('POST /api/register', () => {
  it('should register a new user with a valid password', async () => {
    const newUser = {
      name: 'testuser',
      password: 'ValidPassword1@'
    };

    const response = await request(app)
      .post('/api/register')
      .send(newUser);

    // Assert that the response status is 200 and the user is registered successfully
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Registration successful.');
  });

  it('should return 400 if name or password is missing', async () => {
    const newUser = {
      name: 'testuser',
      password: ''
    };

    const response = await request(app)
      .post('/api/register')
      .send(newUser);

    // Assert that the response status is 400 and the error message is correct
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("\"Name and password are required\"");
  });

  it('should return 400 if the password does not meet complexity requirements', async () => {
    const newUser = {
      name: 'testuser',
      password: 'weakpass'
    };

    const response = await request(app)
      .post('/api/register')
      .send(newUser);

    // Assert that the response status is 400 and the error message is correct
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe( "\"Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.\"");
  });
});


const bcrypt = require('bcrypt');
const saltRounds = 10;

// Test suite for POST /api/login
describe('POST /api/login', () => {
  beforeEach((done) => {
    const plainPassword = 'testpassword';
    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
      if (err) throw err;

      db.serialize(() => {
        db.run('DELETE FROM users WHERE name = ?', ['testuser'], () => {
          db.run('INSERT INTO users (name, password) VALUES (?, ?)', ['testuser', hashedPassword], done);
        });
      });
    });
  });

  it('should log in an existing user with correct credentials', async () => {
    const user = {
      name: 'testuser',
      password: 'testpassword'
    };

    const response = await request(app)
      .post('/api/login')
      .send(user);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful.');
  });

  it('should return 400 if name or password is missing', async () => {
    const user = {
      name: 'testuser',
      password: ''
    };

    const response = await request(app)
      .post('/api/login')
      .send(user);

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("{\"error\":\"Name and password are required.\"}");
  });

  it('should return 401 if the password is incorrect', async () => {
    const user = {
      name: 'testuser',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/login')
      .send(user);

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("{\"error\":\"Invalid name or password.\"}");
  });

  it('should return 401 if the user does not exist', async () => {
    const user = {
      name: 'nonexistentuser',
      password: 'testpassword'
    };

    const response = await request(app)
      .post('/api/login')
      .send(user);

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("{\"error\":\"Invalid name or password.\"}");
  });
});


// Test suite for GET /api/notifications
describe('GET /api/notifications', () => {
  jest.setTimeout(15000); // Increase timeout for this test

  it('should send notifications for upcoming tasks', (done) => {
    const es = new EventSource('http://localhost:3000/api/notifications');

    // Set a timeout to end the test if no messages are received
    const timeout = setTimeout(() => {
      es.close();
      done(new Error('Timed out waiting for notifications'));
    }, 15000);

    es.onmessage = (event) => {
      clearTimeout(timeout); // Clear timeout on successful message

      try {
        const todo = JSON.parse(event.data);
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('title');
        expect(todo).toHaveProperty('description');
        expect(todo).toHaveProperty('dueDate');
        expect(todo).toHaveProperty('priority');
        expect(todo).toHaveProperty('expiration');
        expect(todo).toHaveProperty('completed');

        es.close();
        done();
      } catch (error) {
        es.close();
        done(error);
      }
    };

    es.onerror = (error) => {
      clearTimeout(timeout);
      es.close();
      done(error);
    };
  });
});