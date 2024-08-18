import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import TodoList from './TodoList';
import './Todo.css';

function Todo() {
  const navigate = useNavigate();
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
  const [editMode, setEditMode] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [notifications, setNotifications] = useState([]); // New state for notifications

// Fetch Todos
const fetchTodos = async () => {
  const userId = localStorage.getItem('userId');
  try {
    const response = await axios.get('http://localhost:5000/api/todos', {
      params: {
        userId, // Pass the userId in the request
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

// Add or Edit Todo
const addOrEditTodo = async () => {
  const userId = localStorage.getItem('userId');
  try {
    if (newTodo.title.trim()) {
      const todoData = { ...newTodo, userId };
      if (editMode) {
        await axios.put(`http://localhost:5000/api/todos/${editTodoId}`, todoData);
        setEditMode(false);
        setEditTodoId(null);
      } else {
        await axios.post('http://localhost:5000/api/todos', todoData);
      }
      fetchTodos();
    }
  } catch (error) {
    console.error('Error adding or editing todo:', error);
  }
};

  

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos(); // Fetch the updated todos list after deletion
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const markAsCompleted = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/todos/${id}/complete`);
      fetchTodos(); // Fetch the updated todos list after marking as completed
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
    navigate('/login');
  };

  useEffect(() => {
    fetchTodos();
  }, [filter, sortBy, searchTerm]);

  useEffect(() => {
    // Establish an SSE connection to receive notifications
    const eventSource = new EventSource('http://localhost:5000/api/notifications');

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    };

    // Clean up the EventSource connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div data-testid="todo-1">
      <div className='head'>TODO APPLICATION</div>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      
      <div className="web">
        <h1>Add Task</h1>
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
        <div className='x'>Start Date</div>
        <input
          type="date"
          value={newTodo.dueDate}
          onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
        />
        <div className='x'>Expiration Date and Time</div>
        <input
          type="datetime-local"
          value={newTodo.expiration}
          onChange={(e) => setNewTodo({ ...newTodo, expiration: e.target.value })}
        />
        <div className='x'>Priority</div>
        <select className='z'
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

      <div className='web2'>
      <div className="filter-sort-container">
          <label>Search</label>
          <input
           className='searcht'
            type="text"
            placeholder="Search todos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label>Filter</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div className='y'>
      <h1>My Todo Tasks</h1>
        <ul className='todo-list-container'>
          <TodoList
            todos={todos}
            deleteTodo={deleteTodo}
            markAsCompleted={markAsCompleted}
            startEditing={startEditing}
          />
        </ul>
      </div>   

      <div className="notifications">
        <div className='ti'>Notifications</div>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              {notification.title}: {notification.description} (Due: {new Date(notification.dueDate).toLocaleString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todo;
