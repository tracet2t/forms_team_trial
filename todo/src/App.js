import React, { useState, useEffect } from 'react';  // Ensure useEffect is imported if needed
import './App.css';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch all tasks on initial render
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/tasks');
        if (response.ok) {
          const tasks = await response.json();
          setTasks(tasks);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTasks();
  }, []);

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
        setTasks((prevTasks) => [...prevTasks, savedTask]);
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handler to update a task
  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const savedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === savedTask.id ? savedTask : task))
        );
        setEditingTask(null);  // Clear the editing task
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handler to start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
  };

  return (
    <div className="App">
      <h1>My To-Do List</h1>

      {/* Rendering the AddTask component */}
      <AddTask onAdd={handleAddTask} />

      {/* Rendering the EditTask component if there is a task being edited */}
      {editingTask && (
        <EditTask
          taskId={editingTask.id}
          onUpdate={handleUpdateTask}
          onCancel={() => setEditingTask(null)}  // Cancel editing
        />
      )}

      {/* Displaying the list of tasks */}
      <ul>
        {tasks.map((task) => (
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
