import React, { useState, useEffect } from 'react';
import './EditTask.css';

function EditTask({ taskId, onUpdate, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due_date, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [error, setError] = useState('');

  // Fetch task data for editing when the component mounts or taskId changes
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`);
        if (response.ok) {
          const task = await response.json();
          setTitle(task.title);
          setDescription(task.description);
          setDueDate(task.due_date);
          setPriority(task.priority);
        } else {
          console.error('Failed to fetch task');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTask();
  }, [taskId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === '') {
      setError('Title is required');
      return;
    }

    setError('');

    const updatedTask = {
      id: taskId,
      title,
      description,
      due_date,
      priority,
    };

    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const savedTask = await response.json();
        onUpdate(savedTask);  // Call onUpdate with the updated task
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="edit-task-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="due-date">Due Date</label>
        <input
          id="due-date"
          type="date"
          value={due_date}
          onChange={(e) => setDueDate(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="form-input"
        >
          <option value="">Select</option>  {/* Corrected the default option */}
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <button type="submit" className="edit-task-submit-button">Save Changes</button>
      <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default EditTask;
