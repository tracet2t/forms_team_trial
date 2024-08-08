import React from 'react';

function TodoItem({ todo, deleteTodo }) {
  return (
    <li>
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
      <div>
        <strong>Priority:</strong> {todo.priority}
      </div>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
}

export default TodoItem;
