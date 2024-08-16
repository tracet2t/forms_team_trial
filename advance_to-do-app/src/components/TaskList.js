// src/components/TaskList.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TaskList.css';

const TaskList = ({ tasks, setTasks, fetchTasks }) => {
  
  // Function to mark a task as completed
  const markAsCompleted = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };

  // Function to delete a task
  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="task-list">
      <h1>Task List</h1>
      <Link to="/add" className="add-task-link">Add New Task</Link>
      <ul>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task.id} className="task-item">
              <h2 className="task-title">{task.title}</h2>
              <p className="task-description">{task.description}</p>
              <button className="mark-completed-button" onClick={() => markAsCompleted(task.id)}>
                Mark as Completed
              </button>
              <button className="delete-button" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
              <Link to={`/edit/${task.id}`} className="edit-link">Edit</Link>
            </li>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
