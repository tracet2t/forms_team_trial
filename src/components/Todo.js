import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './TodoList';
import './Todo.css';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    dueDate: '',
    expiration: '',
    priority: 'Medium',
  });
  const [filter, setFilter] = useState('all'); // Filter by status: 'all', 'completed', 'pending'
  const [sortBy, setSortBy] = useState('dueDate'); // Sort by 'dueDate' or 'priority'
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  // Function to fetch all todos with filtering, sorting, and searching
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos', {
        params: {
          status: filter,
          sortBy: sortBy,
          search: searchTerm, // Include the search term
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Function to add a new todo
  const addTodo = async () => {
    try {
      if (newTodo.title.trim()) {
        const response = await axios.post('http://localhost:5000/api/todos', newTodo);
        setTodos([...todos, response.data]);
        setNewTodo({
          title: '',
          description: '',
          dueDate: '',
          expiration: '',
          priority: 'Medium',
        });
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Function to delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Function to mark a todo as completed
  const markAsCompleted = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/todos/${id}/complete`);
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: true } : todo
      ));
    } catch (error) {
      console.error('Error marking todo as completed:', error);
    }
  };

  // Fetch todos when component mounts or filter/sort/search changes
  useEffect(() => {
    fetchTodos();
  }, [filter, sortBy, searchTerm]);

  return (
    <div data-testid="todo-1">
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
        />
        <input
          type="date"
          value={newTodo.dueDate}
          onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="Expiration Date"
          value={newTodo.expiration}
          onChange={(e) => setNewTodo({ ...newTodo, expiration: e.target.value })}
        />
        <select
          value={newTodo.priority}
          onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={addTodo}>Add Todo</button>
      </div>

      <h1> My Tasks </h1>
      <label>Search Your Task</label>
      <input
          type="text"
          placeholder="Search todos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      <div>
        <label>Filter by Status</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <label>Sort by</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      <TodoList todos={todos} deleteTodo={deleteTodo} markAsCompleted={markAsCompleted} />
    </div>
  );
}

export default Todo;
