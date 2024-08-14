const express = require('express'); 
const sqlite3 = require('sqlite3').verbose(); 
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
const cron = require('node-cron'); 
const nodemailer = require('nodemailer'); 

const app = express(); 
const db = new sqlite3.Database('./new.sqlite'); 

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
    completed INTEGER DEFAULT 0
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
    password TEXT NOT NULL
  )`);
});

// Configure the email transporter for sending notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lakshanans1121@gmail.com', 
    pass: '0000000000' 
  }
});

// Function to send an email notification
const sendNotificationEmail = (todo) => {
  const mailOptions = {
    from: 'lakshanans1121@gmail.com',
    to: 's92061078@ousl.lk',
    subject: 'Reminder: Task Due Soon',
    text: `Reminder: The task "${todo.title}" is approaching its due date (${todo.dueDate}).`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error); 
    } else {
      console.log('Email sent:', info.response); 
    }
  });
};

// Scheduled task to check for upcoming tasks and send notifications
cron.schedule('*/10 * * * *', () => {
  const now = new Date();
  const upcomingTime = new Date(now.getTime() + 10 * 60000); // 10 minutes from now

  db.all(`SELECT * FROM todos
          WHERE dueDate IS NOT NULL
          AND completed = 0
          AND strftime('%Y-%m-%dT%H:%M:%S', dueDate) <= strftime('%Y-%m-%dT%H:%M:%S', ?)
          AND id NOT IN (SELECT todoId FROM notifications)`, [upcomingTime.toISOString()], (err, todos) => {
    if (err) {
      console.error('Error fetching todos for notifications:', err); 
      return;
    }

    todos.forEach(todo => {
      sendNotificationEmail(todo); 
      db.run('INSERT INTO notifications (todoId, notifiedAt) VALUES (?, ?)', [todo.id, now.toISOString()], (err) => {
        if (err) {
          console.error('Error inserting notification record:', err); 
        }
      });
    });
  });
});

// Register a new user
app.post('/api/register', (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json("Name and password are required" );
  }

  db.run('INSERT INTO users (name, password) VALUES (?, ?)', [name, password], function(err) {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: 'Failed to register.' });
    }
    res.status(200).json({ message: 'Registration successful.' });
  });
});

// Login user
app.post('/api/login', (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required.' });
  }

  db.get('SELECT * FROM users WHERE name = ? AND password = ?', [name, password], (err, row) => {
    if (err) {
      console.error('Error logging in:', err);
      return res.status(500).json({ error: 'Failed to login.' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid name or password.' });
    }
    res.status(200).json({ message: 'Login successful.' });
  });
});

// Route to get all todos, with optional filtering and sorting
app.get('/api/todos', (req, res) => {
  const { status, sortBy, search } = req.query;

  let query = 'SELECT * FROM todos';
  const params = [];

  // Add filtering by status if specified
  if (status) {
    if (status === 'completed') {
      query += ' WHERE completed = 1';
    } else if (status === 'pending') {
      query += ' WHERE completed = 0';
    }
  }

  // Add search functionality
  if (search) {
    const searchTerm = `%${search}%`;
    query += (query.includes('WHERE') ? ' AND ' : ' WHERE ') + 
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
  const { title, description, dueDate, priority, expiration } = req.body;

  if (!title) {
    return res.status(400).send('Title is required'); 
  }

  db.run('INSERT INTO todos (title, description, dueDate, priority, expiration) VALUES (?, ?, ?, ?, ?)', 
    [title, description, dueDate, priority, expiration], 
    function(err) {
      if (err) {
        return res.status(500).send('Error adding todo'); 
      }
      res.json({ id: this.lastID, title, description, dueDate, priority, expiration, completed: false }); 
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
/*
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); 
});
*/
module.exports = { app, db };
