import React from 'react';
import './App.css';
// import AddTask from './components/AddTask';

function App() {
  return (
    <div className="App">
      <h1>My To-Do List</h1>
      <form>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" type="text" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description"></textarea>
        </div>
        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input id="dueDate" type="date" />
        </div>
        <div>
          <label htmlFor="priority">Priority</label>
          <select id="priority">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}


export default App;