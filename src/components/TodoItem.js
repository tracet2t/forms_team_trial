import React from 'react';
import './Todo.css';

function TodoItem({ todo, deleteTodo, markAsCompleted, startEditing }) {
  return (
    <ul className="todo-list-container">
    <li key={todo.id} >
      <div>
        <strong>Title:</strong> {todo.title}
      </div>
      {todo.description && (
        <div>
          <strong>Description:</strong> {todo.description}
        </div>
      )}
      {todo.dueDate && (
        <div>
          <strong>Due Date:</strong> {new Date(todo.dueDate).toLocaleDateString()}
        </div>
      )}
      {todo.expiration && (
        <div>
          <strong>Expiration:</strong> {new Date(todo.expiration).toLocaleString()}
        </div>
      )}
      <div>
        <strong>Priority:</strong> {todo.priority}
      </div>
      <div>
        <strong>Status:</strong> {todo.completed ? 'Completed' : 'Not Completed'}
      </div>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
      {!todo.completed && (
        <>
          <button onClick={() => markAsCompleted(todo.id)}>Mark as Completed</button>
          <button onClick={() => startEditing(todo)}>Edit</button>
        </>
      )}
    </li>
    </ul>
  );
}

export default TodoItem;