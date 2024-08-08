import axios from 'axios';
import { addTodo } from './path_to_your_function_file'; // Replace with your actual file path

jest.mock('axios'); // Mocking axios

describe('addTodo', () => {
  let setTodos, setNewTodo, newTodo, todos;

  beforeEach(() => {
    setTodos = jest.fn(); // Mocking setTodos
    setNewTodo = jest.fn(); // Mocking setNewTodo
    newTodo = {
      title: 'Test Todo',
      description: 'Test Description',
      dueDate: '2024-08-10',
      priority: 'High',
    };
    todos = []; // Initial empty list of todos
  });

  it('should add a new todo when the title is valid', async () => {
    const mockResponse = {
      data: {
        title: 'Test Todo',
        description: 'Test Description',
        dueDate: '2024-08-10',
        priority: 'High',
      },
    };

    axios.post.mockResolvedValue(mockResponse); // Mocking axios.post to return a resolved promise

    await addTodo();

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5001/api/todos', newTodo);
    expect(setTodos).toHaveBeenCalledWith([mockResponse.data]);
    expect(setNewTodo).toHaveBeenCalledWith({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
    });
  });

  it('should not add a new todo when the title is empty', async () => {
    newTodo.title = ''; // Empty title

    await addTodo();

    expect(axios.post).not.toHaveBeenCalled(); // axios.post should not be called
    expect(setTodos).not.toHaveBeenCalled(); // setTodos should not be called
    expect(setNewTodo).not.toHaveBeenCalled(); // setNewTodo should not be called
  });
});
