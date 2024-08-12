import './App.css';
import { useState } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const addTodo = async () => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, dueDate: new Date().toISOString() }),
    });
    if (response.ok) {
      // Handle successful response
      alert('Todo added successfully!');
    } else {
      // Handle error
      alert('Failed to add todo');
    }
  };

  return (
    <div className="App">
      <h1> FIND FOOD </h1>
      <div className="todo-wrap">
        <div className="input">
          <div className="input-item">
            <label> Title </label>
            <input 
              type="text" 
              placeholder="Add your food type here" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          <br />
          <div className="input-item">
            <label> Description</label>
            <input 
              type="text" 
              placeholder="Add your food description here" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>
          <br />
          <div className="input-item">
            <button type="button" className="Button1" onClick={addTodo}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
