//tests/AddTask.test.js
import { render, screen, fireEvent,  } from '@testing-library/react';
import AddTask from '../components/AddTask'; 

describe('AddTask Component', () => {
  test('renders title input and allows input', () => {
    render(<AddTask />);
    
    // Check if title input is present
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    expect(titleInput.value).toBe('Test Title');
  });

  test('renders description input and allows input', () => {
    render(<AddTask />);

    // Check if the description input is rendered
    const descriptionInput = screen.getByLabelText(/description/i);
    expect(descriptionInput).toBeInTheDocument();

    // Simulate user typing in the description field
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    expect(descriptionInput.value).toBe('Test Description');
  });

  test('renders due date input and allows input', () => {
    render(<AddTask />);

    // Check if the due date input is rendered
    const dueDateInput = screen.getByLabelText(/due date/i);
    expect(dueDateInput).toBeInTheDocument();

    // Simulate user typing in the due date field
    fireEvent.change(dueDateInput, { target: { value: '2024-12-31' } });
    expect(dueDateInput.value).toBe('2024-12-31');
  });

  test('renders priority select and allows selection', () => {
    render(<AddTask />);
    
    const prioritySelect = screen.getByLabelText(/priority/i);
    expect(prioritySelect).toBeInTheDocument();

    fireEvent.change(prioritySelect, { target: { value: 'High' } });
    expect(prioritySelect.value).toBe('High');
  });
  
});

