const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database file or open existing one
const db = new sqlite3.Database(path.join(__dirname, 'tasks.db'));

// Create the tasks table if it doesn't exist
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        priority TEXT
      )
    `);
});

module.exports = db;
