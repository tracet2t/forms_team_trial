import React, { useState } from 'react';
import './AddTask.css';

function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [error, setError] = useState(''); // To store error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (title.trim() === '') {
      setError('Title is required');
      return;
    }

    // Clear the error message if validation passes
    setError('');

    // Prepare task data
    const taskData = { title, description, dueDate, priority };

    try {
      // Send POST request to the backend
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        console.log('Task Submitted:', newTask);

        // Reset the form after successful submission
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('');
      } else {
        // Handle errors from the backend
        setError('Failed to add task');
      }
    } catch (err) {
      // Handle network or other errors
      setError('An error occurred while adding the task');
    }
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
