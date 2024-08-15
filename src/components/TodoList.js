import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, deleteTodo, markAsCompleted, startEditing }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          markAsCompleted={markAsCompleted}
          startEditing={startEditing}
        />
      ))}
    </ul>
  );
}

export default TodoList;
