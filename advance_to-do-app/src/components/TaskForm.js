// src/components/TaskForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/TaskForm.css';

const TaskForm = ({ fetchTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('normal');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Fetch existing task for editing
      const fetchTask = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/tasks/${id}`);
          const task = await response.json();
          setTitle(task.title);
          setDescription(task.description);
          setDueDate(task.due_date);
          setPriority(task.priority);
        } catch (error) {
          console.error('Error fetching task:', error);
        }
      };
      fetchTask();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const url = id
      ? `http://localhost:5000/api/tasks/${id}`
      : 'http://localhost:5000/api/tasks';
    const body = JSON.stringify({ title, description, due_date: dueDate, priority });

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!response.ok) {
        throw new Error('Failed to save task');
      }
      await response.json();
      fetchTasks();
      navigate('/');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="task-form-container">
      <h1>{id ? 'Edit Task' : 'Add New Task'}</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <label className="form-label">
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
          />
        </label>
        <label className="form-label">
          Due Date:
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
          />
        </label>
        <label className="form-label">
          Priority:
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-select"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </label>
        <button type="submit" className="submit-button">
          Save Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
