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
  exports.deleteTodo = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM todos WHERE id = ?';
    connection.query(sql, [id], (err) => {
      if (err) throw err;
      res.json({ success: true });
    });
  };
  exports.completeTodo = (req, res) => {
    const { id } = req.params;
    const completedOn = new Date();
    const sql = 'UPDATE todos SET completed = 1, completedOn = ? WHERE id = ?';
    connection.query(sql, [completedOn, id], (err) => {
      if (err) throw err;
      res.json({ success: true, completedOn });
    });
  };
  
