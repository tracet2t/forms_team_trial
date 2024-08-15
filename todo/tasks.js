const express = require('express');
const app = express();
app.use(express.json());

let tasks = [];

app.post('/api/tasks', (req, res) => {
    const task = req.body;
    tasks.push(task);
    res.status(201).send(task);
});

app.get('/api/tasks', (req, res) => {
    res.send(tasks);
});

app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter((task, index) => index !== id);
    res.status(204).send();
});

module.exports = app;
