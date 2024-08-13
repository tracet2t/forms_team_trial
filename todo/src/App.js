import React from 'react';
import './App.css';
import AddTask from './components/AddTask'; // Importing AddTask component

function App() {
  return (
    <div className="App">
      <h1>My To-Do List</h1>
      {/* Rendering the AddTask component */}
      <AddTask />
    </div>
  );
}

export default App;
