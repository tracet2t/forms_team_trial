const express = require('express'); 
const sqlite3 = require('sqlite3').verbose(); 
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
const cron = require('node-cron'); 
const nodemailer = require('nodemailer'); 


const app = express(); 
const db = new sqlite3.Database('./db.sqlite'); 

app.use(bodyParser.json()); 
app.use(cors()); 
// Initialize database tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    dueDate TEXT,
    priority TEXT,
    expiration TEXT,
    completed INTEGER DEFAULT 0,
    userId INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todoId INTEGER,
    notifiedAt DATETIME,
    FOREIGN KEY (todoId) REFERENCES todos(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    userId TEXT NOT NULL UNIQUE
  )`);``
});

const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt
const { v4: uuidv4 } = require('uuid');
// Register a new user
app.post('/api/register', async (req, res) => {
  const { name, password } = req.body;
  const userId = uuidv4();
  // Check if name and password are provided
  if (!name || !password) {
    return res.status(400).json("Name and password are required");
  }

  // Password complexity validation (at least one uppercase, one lowercase, one number, and one special character)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json("Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.");
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database with the hashed password
    db.run('INSERT INTO users (name, password,userId) VALUES (?, ?, ?)', [name, hashedPassword, userId], function(err) {
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


// Login user
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

    // Compare the provided password with the hashed password stored in the database
    bcrypt.compare(password, row.password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Failed to login.' });
      }

      if (result) {
        // Passwords match, return userId and name
        res.status(200).json({ userId: row.userId, name: row.name });
      } else {
        // Passwords don't match
        res.status(401).json({ error: 'Invalid name or password.' });
      }
    });
  });
});


// Route to get a specific user by their userId
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
    res.json(row); // Sends the user name to the client
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


// Route to get a specific todo by its ID
app.get('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM todos WHERE id = ?', id, (err, row) => {
    if (err) {
      return res.status(500).send('Error fetching todo'); 
    }
    if (!row) {
      return res.status(404).send('Todo not found'); 
    }
    row.completed = row.completed === 1;
    res.json(row); 
  });
});

// Route to create a new todo
app.post('/api/todos', (req, res) => {
  const { title, description, dueDate, priority, expiration, userId } = req.body;

  console.log('Received userId:', userId);
  if (!title) {
    return res.status(400).send('Title is required');
  }

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  db.run('INSERT INTO todos (title, description, dueDate, priority, expiration, userId) VALUES (?, ?, ?, ?, ?, ?)', 
    [title, description, dueDate, priority, expiration, userId], 
    function(err) {
      if (err) {
        console.error('Error adding todo:', err);
        return res.status(500).send('Error adding todo');
      }
      res.json({ id: this.lastID, title, description, dueDate, priority, expiration, completed: false, userId });
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

//sent notification 
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

app.get('/api/notifications', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send a notification every 5 seconds
  const intervalId = setInterval(() => {
    const notification = {
      id: new Date().getTime(),
      title: 'Notification Title',
      description: 'Notification Description',
      dueDate: new Date().toISOString(),
      priority: 'High',
      expiration: new Date().toISOString(),
      completed: false
    };
    res.write('data: ${JSON.stringify(notification)}\n\n');
  }, 5000);

  // Clean up interval when connection is closed
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); 
});

module.exports = { app, db };