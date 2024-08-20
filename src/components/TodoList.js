import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, deleteTodo, markAsCompleted, startEditing }) {
  const userId = localStorage.getItem('userId'); // Or however you manage user ID

  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          markAsCompleted={markAsCompleted}
          startEditing={startEditing}
          userId={userId} // Pass userId if needed
        />
      ))}
    </>
  );
}

export default TodoList;
