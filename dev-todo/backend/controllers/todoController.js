const connection = require('../db/connection');

exports.getAllTodos = (req, res) => {
  const sql = 'SELECT * FROM todos WHERE completed = 0';
  connection.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};
exports.getCompletedTodos = (req, res) => {
    const sql = 'SELECT * FROM todos WHERE completed = 1';
    connection.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  };
  exports.addTodo = (req, res) => {
    const { title, description, dueDate } = req.body;
    const sql = 'INSERT INTO todos (title, description, dueDate, completed) VALUES (?, ?, ?, 0)';
    connection.query(sql, [title, description, dueDate], (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, title, description, dueDate, completed: 0 });
    });
  };
  
