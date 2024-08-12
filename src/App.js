import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './components/TodoList';
import './App.css';
import Todo from './components/Todo'

function App() {
 
  return (
    <div>
      <Todo/>
    </div>
  );
}

export default App;
