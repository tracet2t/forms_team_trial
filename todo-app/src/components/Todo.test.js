import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Todo from './Todo';

test('renders To-Do List heading', () => {
    render(<Todo />);
    const headingElement = screen.getByText(/To-Do List/i);
    expect(headingElement).toBeInTheDocument();
});
test('render check heading',() => {
    render(<Todo/>);
    const headingElement= screen.getByText(/check/i);
    expect(headingElement).toBeInTheDocument();
});

test('adds a new task', () => {
    render(<Todo />);
    const inputElement = screen.getByPlaceholderText(/Add a new task/i);
    const addButton = screen.getByText(/Add/i);

    fireEvent.change(inputElement, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    const taskElement = screen.getByText(/New Task/i);
    expect(taskElement).toBeInTheDocument();
});

test('removes a task', () => {
    render(<Todo />);
    const inputElement = screen.getByPlaceholderText(/Add a new task/i);
    const addButton = screen.getByText(/Add/i);

    fireEvent.change(inputElement, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    const removeButton = screen.getByText(/Remove/i);
    fireEvent.click(removeButton);

    const taskElement = screen.queryByText(/New Task/i);
    expect(taskElement).not.toBeInTheDocument();
});
