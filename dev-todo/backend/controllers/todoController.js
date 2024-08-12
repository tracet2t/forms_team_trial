const connection = require('../db/connection');

exports.getAllTodos = (req, res) => {
  const sql = 'SELECT * FROM todos WHERE completed = 0';
  connection.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};
