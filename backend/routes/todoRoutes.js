const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/todos', todoController.getAllTodos);
router.get('/todos/completed', todoController.getCompletedTodos);
router.post('/todos', todoController.addTodo);
router.delete('/todos/:id', todoController.deleteTodo);
router.put('/todos/complete/:id', todoController.completeTodo); // This will move the task to the completed_todos table
router.delete('/todos/completed/:id', todoController.deleteCompletedTodo);

module.exports = router;
