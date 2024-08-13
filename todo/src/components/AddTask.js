// src/components/AddTask.js
import React, { useState } from 'react';
import './AddTask.css';

function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [error, setError] = useState(''); // To store error messages


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim() === '') {
      setError();
      return;
    }

    // Clear the error message if validation passes
    setError('');

     //handle the form submission, such as sending the data to an API or updating the state in a parent component.
    console.log('Task Submitted:', { title, description, dueDate, priority });

    // Reset the form after submission
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('');
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>       
    {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}          
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required // Ensures that the title field is marked as required in the UI
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    
      <div>
        <label htmlFor="due-date">Due Date</label>
        <input
          id="due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      
      
<div>
      <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <button type="submit">Add Task</button> 
    </form>
  );
}

export default AddTask;
