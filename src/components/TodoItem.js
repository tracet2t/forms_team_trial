import React from 'react';
import './Todo.css';

function TodoItem({ todo, deleteTodo, markAsCompleted, startEditing, userId }) {
  return (
    <ul className="todo-list-container">
      <li key={todo.id}>
        <div className='ti'>{todo.title}</div>
        {todo.description && (
          <div className='dis'>{todo.description}</div>
        )}
        <div className='cont'>
          {todo.dueDate && (
            <div>
              <strong>Start Date</strong> {new Date(todo.dueDate).toLocaleDateString()}
            </div>
          )}
          {todo.expiration && (
            <div>
              <strong>Due</strong> {new Date(todo.expiration).toLocaleString()}
            </div>
          )}
          <div>
            <strong>Priority</strong> {todo.priority}
          </div>
          <div>
            <strong>Status</strong> {todo.completed ? 'Completed' : 'Not Completed'}
          </div>
        </div>
        <div className='cont'>
          <button className="delete-button" onClick={() => deleteTodo(todo.id)}>Delete</button>
          {!todo.completed && (
            <>
              <button className="complete-button" onClick={() => markAsCompleted(todo.id)}>Mark as Completed</button>
              <button className="edit-button" onClick={() => startEditing(todo)}>Edit</button>
            </>
          )}
        </div>
      </li>
    </ul>
  );
}

export default TodoItem;



