const connection = require('../db/connection');

exports.getAllTodos = (req, res) => {
  const sql = 'SELECT * FROM todos';
  connection.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.getCompletedTodos = (req, res) => {
  const sql = 'SELECT * FROM completed_todos';
  connection.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.deleteCompletedTodo = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM completed_todos WHERE id = ?';
  connection.query(sql, [id], (err) => {
    if (err) throw err;
    res.json({ success: true });
  });
};

exports.addTodo = (req, res) => {
  const { title, description, dueDate } = req.body;
  const sql = 'INSERT INTO todos (title, description, dueDate) VALUES (?, ?, ?)';
  connection.query(sql, [title, description, dueDate], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, title, description, dueDate });
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

  // Move the task to completed_todos table
  const moveToCompletedSql = `
    INSERT INTO completed_todos (title, description, dueDate, completedOn)
    SELECT title, description, dueDate, ? FROM todos WHERE id = ?;
  `;
  connection.query(moveToCompletedSql, [completedOn, id], (err) => {
    if (err) throw err;

    // Delete the task from the todos table
    const deleteFromTodosSql = 'DELETE FROM todos WHERE id = ?';
    connection.query(deleteFromTodosSql, [id], (err) => {
      if (err) throw err;
      res.json({ success: true, completedOn });
    });
  });
};
