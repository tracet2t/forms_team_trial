import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

describe('Component', () => {

  test('add new todo item', () => {
    render(<App />);

    const titleInput = screen.getByPlaceholderText(/Enter Task Title/i);
    const descriptionInput = screen.getByPlaceholderText(/Enter Task Description/i);
    const dueDateInput = screen.getByPlaceholderText(/Enter Date/i);
    const addButton = screen.getByText(/Add/i);

    fireEvent.change(titleInput, { target: { value: 'Task 1' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.change(dueDateInput, { target: { value: '2021-08-10' } });

    fireEvent.click(addButton);

    const newTaskTitle = screen.getByText(/Task 1/i);
    const newTaskDescription = screen.getByText(/New Description/i);
    const newTaskDate = screen.getByText(/2021-08-10/i);

    expect(newTaskTitle).toBeInTheDocument();
    expect(newTaskDescription).toBeInTheDocument();
    expect(newTaskDate).toBeInTheDocument();
  });

  test('load todo from localStorage', () => {
    const todos = [
      { title: 'Task Saving', description: 'Desc Saving', dueDate: '2021-10-18' }
    ];
    localStorage.setItem('todolist', JSON.stringify(todos));

    render(<App />);

    const savedTaskTitle = screen.getByText(/Task Saving/i);
    const savedTaskDescription = screen.getByText(/Desc Saving/i);
    const savedTaskDate = screen.getByText(/2021-10-18/i);

    expect(savedTaskTitle).toBeInTheDocument();
    expect(savedTaskDescription).toBeInTheDocument();
    expect(savedTaskDate).toBeInTheDocument();
  });

  test('toggle between Pending and Complete section', () => {
    render(<App />);

    const pendingButton = screen.getByText(/Pending/i);
    const completedButton = screen.getByText(/Completed/i);

    expect(pendingButton).toHaveClass('active');
    expect(completedButton).not.toHaveClass('active');

    fireEvent.click(completedButton);

    expect(pendingButton).not.toHaveClass('active');
    expect(completedButton).toHaveClass('active');
  });
});
