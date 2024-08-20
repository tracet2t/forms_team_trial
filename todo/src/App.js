import React, { useState } from 'react';
import './App.css';
import AddTask from './components/AddTask'; 
import EditTask from './components/EditTask'; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // Handler to add a new task
  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const savedTask = await response.json();
        setTasks([...tasks, savedTask]);
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handler to update a task
  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null); // Clear the editing task
  };

   // Handler to start editing a task
   const startEditing = (task) => {
    setEditingTask(task.id);
  };

  return (
    <div className="App">
      <h1>My To-Do List</h1>

      {/* Rendering the AddTask component */}
      <AddTask onAdd={handleAddTask} />

      {/* Rendering the EditTask component if there is a task being edited */}
      {editingTask && (
        <EditTask 
          taskId={editingTask} 
          onUpdate={handleUpdateTask} 
          onCancel={() => setEditingTask(null)} // Cancel editing
        />
      )}

      {/* Displaying the list of tasks */}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.title}</span>
            <button onClick={() => startEditing(task)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
