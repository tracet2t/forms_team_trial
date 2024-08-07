import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './TodoList';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('/api/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      const response = await axios.post('/api/todos', { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    }
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/api/todos/${id}`);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <TodoList todos={todos} deleteTodo={deleteTodo} />
    </div>
  );
}

export default App;
