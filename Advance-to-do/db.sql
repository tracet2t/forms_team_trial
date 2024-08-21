CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    priority TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    expirationDate TEXT,
    expirationTime TEXT,
    userId INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id)
);
