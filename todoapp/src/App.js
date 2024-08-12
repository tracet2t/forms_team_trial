import React, { useEffect, useState } from 'react';
import './App.css';
import { BsTrash } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setDueDate] = useState();
  const [completedTodos, setCompletedTodos] = useState([]);

  const fetchTodos = async () => {
    const response = await fetch('http://localhost:5000/api/todos');
    const data = await response.json();
    setTodos(data);
  };

  const fetchCompletedTodos = async () => {
    const response = await fetch('http://localhost:5000/api/todos/completed');
    const data = await response.json();
    setCompletedTodos(data);
  };

  useEffect(() => {
    fetchTodos();
    fetchCompletedTodos();
  }, []);

  const handleAddToDo = async () => {
    const newTodoItem = {
      title: newTitle,
      description: newDescription,
      dueDate: newDueDate
    };
    const response = await fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodoItem),
    });
    const data = await response.json();
    setTodos([...allTodos, data]);
    setNewTitle("");
    setNewDescription("");
    setDueDate("");
  };

  const handleDeleteTodo = async (id) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'DELETE',
    });
    setTodos(allTodos.filter(todo => todo.id !== id));
  };

  const handleDeleteCompletedTodo = async (id) => {
    await fetch(`http://localhost:5000/api/todos/completed/${id}`, {
      method: 'DELETE',
    });
    setCompletedTodos(completedTodos.filter(todo => todo.id !== id));
  };

  const handleComplete = async (id) => {
    const response = await fetch(`http://localhost:5000/api/todos/complete/${id}`, {
      method: 'PUT',
    });
    const { completedOn } = await response.json();
    const completedTodo = allTodos.find(todo => todo.id === id);
    setCompletedTodos([...completedTodos, { ...completedTodo, completedOn }]);
    setTodos(allTodos.filter(todo => todo.id !== id));
  };

  return (
    <div className="App">
      <h1>ToDoApp</h1>
      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder='Enter Task Title' />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input type='text' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder='Enter Task Description' />
          </div>
          <div className='todo-input-item'>
            <label>Due Date</label>
            <input type='date' value={newDueDate} onChange={(e) => setDueDate(e.target.value)} placeholder='Enter Date' />
          </div>
          <div className='todo-input-item'>
            <button type='button' onClick={handleAddToDo} className='primaryBtn'>Add</button>
          </div>
        </div>
        <div className="btn-area">
          <button className={`secondaryBtn ${!isCompleteScreen && 'active'}`} onClick={() => setIsCompleteScreen(false)}>Pending</button>
          <button className={`secondaryBtn ${isCompleteScreen && 'active'}`} onClick={() => setIsCompleteScreen(true)}>Completed</button>
        </div>
        <div className='todo-list'>
          {!isCompleteScreen && allTodos.map((item) => (
            <div className='todo-list-item' key={item.id}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>{item.dueDate}</p>
              </div>
              <div>
                <BsTrash className='icon' onClick={() => handleDeleteTodo(item.id)} title='Delete?' />
                <FaCheck className='check-icon' onClick={() => handleComplete(item.id)} title='Complete?' />
              </div>
            </div>
          ))}

          {isCompleteScreen && completedTodos.map((item) => (
            <div className='todo-list-item' key={item.id}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>{item.dueDate}</p>
                <p><small>Completed on: {item.completedOn}</small></p>
              </div>
              <div>
                <BsTrash className='icon' onClick={() => handleDeleteCompletedTodo(item.id)} title='Delete?' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
