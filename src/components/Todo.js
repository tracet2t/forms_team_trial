import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import TodoList from './TodoList';
import './Todo.css';

function Todo() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    dueDate: '',
    expiration: '',
    priority: 'Medium',
  });
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false); // Track if we are editing
  const [editTodoId, setEditTodoId] = useState(null); // Track which todo is being edited

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos', {
        params: {
          status: filter,
          sortBy: sortBy,
          search: searchTerm,
        },
      });
      setTodos(response.data);
      localStorage.setItem('todos', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addOrEditTodo = async () => {
    try {
      if (newTodo.title.trim()) {
        if (editMode) {
          // Edit existing todo
          const response = await axios.put(`http://localhost:5000/api/todos/${editTodoId}`, newTodo);
          const updatedTodos = todos.map((todo) =>
            todo.id === editTodoId ? response.data : todo
          );
          setTodos(updatedTodos);
          setEditMode(false); // Exit edit mode after saving
          setEditTodoId(null); // Clear the edit ID
        } else {
          // Add new todo
          const response = await axios.post('http://localhost:5000/api/todos', newTodo);
          const updatedTodos = [...todos, response.data];
          setTodos(updatedTodos);
        }
        setNewTodo({
          title: '',
          description: '',
          dueDate: '',
          expiration: '',
          priority: 'Medium',
        });
        localStorage.setItem('todos', JSON.stringify(todos)); // Update localStorage
      }
    } catch (error) {
      console.error('Error adding or editing todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const markAsCompleted = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/todos/${id}/complete`);
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      );
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error marking todo as completed:', error);
    }
  };

  const startEditing = (todo) => {
    setNewTodo({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      expiration: todo.expiration,
      priority: todo.priority,
    });
    setEditMode(true);
    setEditTodoId(todo.id);
  };

  const handleLogout = () => {
    // Clear user session or token here if needed
    navigate('/login'); // Navigate to the login page
  };

  useEffect(() => {
    fetchTodos();
  }, [filter, sortBy, searchTerm]);

  return (
    <div data-testid="todo-1">
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <div clas="web">
        <h1>Todo List</h1>
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
        <button onClick={addOrEditTodo}>
          {editMode ? 'Save Changes' : 'Add Todo'}
        </button>
        {editMode && <button onClick={() => setEditMode(false)}>Cancel</button>}
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
      <TodoList
        todos={todos}
        deleteTodo={deleteTodo}
        markAsCompleted={markAsCompleted}
        startEditing={startEditing}
      />
    </div>
  );
}

export default Todo;
