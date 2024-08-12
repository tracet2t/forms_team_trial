// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the to-do list heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/my to-do list/i);
  expect(headingElement).toBeInTheDocument();
});
