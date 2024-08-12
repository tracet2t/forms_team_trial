import { render, screen } from '@testing-library/react';
import App from './App';  // Correctly import the App component

test('renders FIND FOOD title', () => {
  render(<App />);
  const titleElement = screen.getByText(/FIND FOOD/i);
  expect(titleElement).toBeInTheDocument();
});
