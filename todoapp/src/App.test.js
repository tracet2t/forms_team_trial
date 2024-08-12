import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

describe('ToDo App', () => {
  test('renders the app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/ToDoApp/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('adds a new todo item', async () => {
    render(<App />);

    const titleInput = screen.getByPlaceholderText('Enter Task Title');
    const descriptionInput = screen.getByPlaceholderText('Enter Task Description');
    const dateInput = screen.getByPlaceholderText('Enter Date');
    const addButton = screen.getByText('Add');

    fireEvent.change(titleInput, { target: { value: 'Test 1' } });
    fireEvent.change(descriptionInput, { target: { value: 'Desc 1' } });
    fireEvent.change(dateInput, { target: { value: '2024-09-12' } });
    fireEvent.click(addButton);

    const newTodoTitle = await screen.findByText('Test 1');
    const newTodoDescription = await screen.findByText('Desc 1');

    expect(newTodoTitle).toBeInTheDocument();
    expect(newTodoDescription).toBeInTheDocument();
  });

  test('completes a todo item', async () => {
    render(<App />);

    const completeButtons = await screen.findAllByTitle('Complete?');
    fireEvent.click(completeButtons[0]);


    const completedTab = screen.getByText('Completed');
    fireEvent.click(completedTab);

    const completedTodo = await screen.findByText(/Completed on:/i);
    expect(completedTodo).toBeInTheDocument();
  });

});