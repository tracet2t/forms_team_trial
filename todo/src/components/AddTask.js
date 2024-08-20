import React, { useState } from 'react';
import './AddTask.css';

function AddTask({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due_date, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === '') {
      setError('Title is required');
      return;
    }

    setError('');

    const newTask = {
      id: Date.now(),
      title,
      description,
      due_date,
      priority,
    };

    onAdd(newTask);

    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('');
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
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
          <option value="Select">Select</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <button type="submit" className="add-task-submit-button">Add Task</button>
    </form>
  );
}

export default AddTask;
