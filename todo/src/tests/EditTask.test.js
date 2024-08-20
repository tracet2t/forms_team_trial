// src/components/__tests__/EditTask.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditTask from '../components/EditTask'; 

describe('EditTask Component', () => {
  const task = {
    id: 1,
    title: 'Existing Task',
    description: 'Existing description',
    dueDate: '2024-12-31',
    priority: 'Medium'
  };

  test('renders the edit form with pre-filled values', () => {
    render(<EditTask task={task} />);
    
    expect(screen.getByLabelText(/title/i).value).toBe(task.title);
    expect(screen.getByLabelText(/description/i).value).toBe(task.description);
    expect(screen.getByLabelText(/due date/i).value).toBe(task.dueDate);
    expect(screen.getByLabelText(/priority/i).value).toBe(task.priority);
  });
 // Test case: Updates task on form submit
 test('updates task on form submit', () => {
    const mockUpdateTask = jest.fn();
    render(<EditTask task={task} onUpdate={mockUpdateTask} />);
    
    // Simulate user editing the task
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Task' } });
    fireEvent.click(screen.getByText(/save/i));
    
    expect(mockUpdateTask).toHaveBeenCalledWith({
      ...task,
      title: 'Updated Task',
    });
  });
  
});
