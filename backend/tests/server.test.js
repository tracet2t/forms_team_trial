const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const app = express();

// Set up your express application
app.use(bodyParser.json());
app.use(cors());

// In-memory SQLite database for testing
const db = new sqlite3.Database(':memory:');
app.locals.db = db;

// Initialize database tables for testing
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    userId TEXT NOT NULL UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    dueDate TEXT,
    priority TEXT,
    expiration TEXT,
    completed INTEGER DEFAULT 0,
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todoId INTEGER NOT NULL,
    notifiedAt TEXT NOT NULL,
    FOREIGN KEY (todoId) REFERENCES todos(id)
  )`);
});

// Register route
app.post('/api/register', async (req, res) => {
  const { name, password } = req.body;
  const userId = uuidv4();

  if (!name || !password) {
    return res.status(400).json("Name and password are required");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json("Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (name, password, userId) VALUES (?, ?, ?)', [name, hashedPassword, userId], function (err) {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: 'Failed to register.' });
      }
      res.status(200).json({ message: 'Registration successful.' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Failed to register.' });
    
  }
});

// Login route
app.post('/api/login', (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required.' });
  }

  db.get('SELECT * FROM users WHERE name = ?', [name], (err, row) => {
    if (err) {
      console.error('Error logging in:', err);
      return res.status(500).json({ error: 'Failed to login.' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid name or password.' });
    }

    bcrypt.compare(password, row.password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Failed to login.' });
      }

      if (result) {
        res.status(200).json({ userId: row.userId, name: row.name });
      } else {
        res.status(401).json({ error: 'Invalid name or password.' });
      }
    });
  });
});

// Get user by userId route
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;

  db.get('SELECT name FROM users WHERE userId = ?', [userId], (err, row) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Failed to fetch user.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(row);
  });
});

// Route to get all todos, with optional filtering and sorting
app.get('/api/todos', (req, res) => {
  const { userId, status, sortBy, search } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  let query = 'SELECT * FROM todos WHERE userId = ?';
  const params = [userId];

  // Add filtering by status if specified
  if (status) {
    if (status === 'completed') {
      query += ' AND completed = 1';
    } else if (status === 'pending') {
      query += ' AND completed = 0';
    }
  }

  // Add search functionality
  if (search) {
    const searchTerm = `%${search}%`;
    query += (query.includes('WHERE') ? ' AND ' : ' AND ') + 
             '(title LIKE ? OR description LIKE ?)';
    params.push(searchTerm, searchTerm);
  }

  // Add sorting if specified
  if (sortBy) {
    if (sortBy === 'dueDate') {
      query += ' ORDER BY dueDate';
    } else if (sortBy === 'priority') {
      query += ' ORDER BY priority';
    }
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).send('Error fetching todos'); 
    }
    res.json(rows); 
  });
});

// Route to create a new todo
app.post('/api/todos', (req, res) => {
  const { title, description, dueDate, priority, expiration, userId } = req.body;

  if (!title) {
    return res.status(400).send('Title is required');
  }

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  db.run('INSERT INTO todos (title, description, dueDate, priority, expiration, completed, userId) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [title, description, dueDate, priority, expiration, 0, userId], 
    function(err) {
      if (err) {
        console.error('Error adding todo:', err);
        return res.status(500).send('Error adding todo');
      }
      res.json({ id: this.lastID, title, description, dueDate, priority, expiration, completed: false, userId });
    });
});

// Test cases for User API
describe('User API', () => {
  beforeEach((done) => {
    db.serialize(() => {
      db.run('DELETE FROM users', done);
    });
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ name: 'John Doe', password: 'Password@123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Registration successful.');
  });

  it('should not register a user with missing fields', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ name: '' });

    expect(response.status).toBe(400);
    expect(response.body).toBe('Name and password are required');
  });

  it('should log in a user with correct credentials', async () => {
    const password = 'Password@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run('INSERT INTO users (name, password, userId) VALUES (?, ?, ?)', ['John Doe', hashedPassword, uuidv4()]);

    const response = await request(app)
      .post('/api/login')
      .send({ name: 'John Doe', password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId');
    expect(response.body.name).toBe('John Doe');
  });

  it('should not log in a user with incorrect credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ name: 'John Doe', password: 'WrongPassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid name or password.');
  });

  it('should get user by userId', async () => {
    const userId = uuidv4();
    db.run('INSERT INTO users (name, password, userId) VALUES (?, ?, ?)', ['John Doe', 'Password@123', userId]);

    const response = await request(app)
      .get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('John Doe');
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .get('/api/users/non-existent-id');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found.');
  });
});

// Test cases for Todo API
describe('Todo API', () => {
  beforeEach((done) => {
    db.serialize(() => {
      db.run('DELETE FROM todos', done);
    });
  });

  it('should create a new todo', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({
        title: 'New Todo',
        description: 'This is a new todo item.',
        dueDate: '2024-08-20',
        priority: 'high',
        expiration: '2024-08-22',
        userId: 'some-valid-user-id'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('New Todo');
  });

  it('should return error if title is missing', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({
        description: 'This is a new todo item.',
        dueDate: '2024-08-20',
        priority: 'high',
        expiration: '2024-08-22',
        userId: 'some-valid-user-id'
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Title is required');
  });
});

// Route to delete a todo by its ID
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM todos WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).send('Error deleting todo'); 
    }
    if (this.changes === 0) {
      return res.status(404).send('Todo not found'); 
    }
    res.status(204).send(); 
  });
});

// Route to mark a todo as completed
app.patch('/api/todos/:id/complete', (req, res) => {
  const { id } = req.params;
  db.run('UPDATE todos SET completed = true WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).send('Error updating todo'); 
    }
    if (this.changes === 0) {
      return res.status(404).send('Todo not found'); 
    }
    res.status(200).send('Todo marked as completed'); 
  });
});

// Route to edit an existing todo by its ID
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, expiration, priority } = req.body;

  // Check if at least one field is provided for update
  if (!title && !description && !dueDate && !expiration && !priority) {
    return res.status(400).send('At least one field is required for update');
  }

  // Construct the SQL query dynamically based on provided fields
  let query = 'UPDATE todos SET';
  const params = [];

  if (title) {
    query += ' title = ?,';
    params.push(title);
  }
  if (description) {
    query += ' description = ?,';
    params.push(description);
  }
  if (dueDate) {
    query += ' dueDate = ?,';
    params.push(dueDate);
  }
  if (expiration) {
    query += ' expiration = ?,';
    params.push(expiration);
  }
  if (priority) {
    query += ' priority = ?,';
    params.push(priority);
  }

  // Remove the trailing comma and add the WHERE clause
  query = query.slice(0, -1);
  query += ' WHERE id = ?';
  params.push(id);

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).send('Error updating todo');
    }
    if (this.changes === 0) {
      return res.status(404).send('Todo not found');
    }
    res.status(200).send('Todo updated successfully');
  });
});

// SSE endpoint for sending task notifications
app.get('/api/notifications', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Function to send a message to the client
  const sendNotification = (todo) => {
    res.write(`data: ${JSON.stringify(todo)}\n\n`);
  };

  // Check for upcoming tasks every 10 seconds
  const intervalId = setInterval(() => {
    const now = new Date();
    const upcomingTime = new Date(now.getTime() + 10 * 60000); // 10 minutes from now

    db.all(`SELECT * FROM todos WHERE dueDate IS NOT NULL
            AND completed = 0
            AND strftime('%Y-%m-%dT%H:%M:%S', dueDate) <= strftime('%Y-%m-%dT%H:%M:%S', ?)
            AND id NOT IN (SELECT todoId FROM notifications)`, [upcomingTime.toISOString()], (err, todos) => {
      if (err) {
        console.error('Error fetching todos for notifications:', err);
        return;
      }

      todos.forEach(todo => {
        sendNotification(todo);
        db.run('INSERT INTO notifications (todoId, notifiedAt) VALUES (?, ?)', [todo.id, now.toISOString()], (err) => {
          if (err) {
            console.error('Error inserting notification record:', err);
          }
        });
      });
    });
  }, 10000); // Check every 10 seconds

  // Cleanup interval when client disconnects
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

describe('Todo API', () => {
  beforeEach((done) => {
    db.serialize(() => {
      db.run('DELETE FROM todos', done);
    });
  });

  it('should delete a todo by ID', async () => {
    const { lastID } = await new Promise((resolve, reject) => {
      db.run('INSERT INTO todos (title, userId) VALUES (?, ?)', ['Todo to delete', 'some-valid-user-id'], function (err) {
        if (err) return reject(err);
        resolve(this);
      });
    });

    const response = await request(app)
      .delete(`/api/todos/${lastID}`);

    expect(response.status).toBe(204);

    // Verify the todo is deleted
    const todo = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM todos WHERE id = ?', [lastID], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    expect(todo).toBeUndefined();
  });

  it('should return 404 when deleting a non-existent todo', async () => {
    const response = await request(app)
      .delete('/api/todos/99999');

    expect(response.status).toBe(404);
    expect(response.text).toBe('Todo not found');
  });

  it('should mark a todo as completed', async () => {
    const { lastID } = await new Promise((resolve, reject) => {
      db.run('INSERT INTO todos (title, userId) VALUES (?, ?)', ['Todo to complete', 'some-valid-user-id'], function (err) {
        if (err) return reject(err);
        resolve(this);
      });
    });

    const response = await request(app)
      .patch(`/api/todos/${lastID}/complete`);

    expect(response.status).toBe(200);
    expect(response.text).toBe('Todo marked as completed');

    // Verify the todo is marked as completed
    const todo = await new Promise((resolve, reject) => {
      db.get('SELECT completed FROM todos WHERE id = ?', [lastID], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    expect(todo.completed).toBe(1);
  });

  it('should update an existing todo', async () => {
    const { lastID } = await new Promise((resolve, reject) => {
      db.run('INSERT INTO todos (title, userId) VALUES (?, ?)', ['Todo to update', 'some-valid-user-id'], function (err) {
        if (err) return reject(err);
        resolve(this);
      });
    });

    const response = await request(app)
      .put(`/api/todos/${lastID}`)
      .send({ title: 'Updated Todo', description: 'Updated description' });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Todo updated successfully');

    // Verify the todo is updated
    const todo = await new Promise((resolve, reject) => {
      db.get('SELECT title, description FROM todos WHERE id = ?', [lastID], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    expect(todo.title).toBe('Updated Todo');
    expect(todo.description).toBe('Updated description');
  });

  it('should return 404 when updating a non-existent todo', async () => {
    const response = await request(app)
      .put('/api/todos/99999')
      .send({ title: 'Updated Todo' });

    expect(response.status).toBe(404);
    expect(response.text).toBe('Todo not found');
  });

  it('should handle SSE notifications', (done) => {
    // Set a timeout to end the test after a certain period
    const testTimeout = setTimeout(() => {
      done(new Error('Test timed out'));
    }, 10000); // Adjust this value as needed
  
    // Start the SSE test
    const intervalId = setInterval(() => {
      request(app)
        .get('/api/notifications')
        .expect('Content-Type', /text\/event-stream/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            clearInterval(intervalId);
            clearTimeout(testTimeout);
            done(err);
          } else {
            // Add your assertions here
  
            // Clean up
            clearInterval(intervalId);
            clearTimeout(testTimeout);
            done();
          }
        });
    }, 1000); // Interval to check notifications every second
  
    // Ensure the test ends if the SSE endpoint never sends data
    setTimeout(() => {
      clearInterval(intervalId);
      clearTimeout(testTimeout);
      done(new Error('SSE test failed to receive data'));
    }, 10000); // Timeout to fail if no data is received in this time
  });
});  