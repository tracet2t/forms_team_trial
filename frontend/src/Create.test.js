
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Create from './Create';

describe('Create Component', () => {
    test('renders the Create form correctly', () => {
        render(<Create />);
        
 
        expect(screen.getByText(/Add Member/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    test('input fields should be empty initially', () => {
        render(<Create />);
        
 
        expect(screen.getByPlaceholderText(/Enter name/i)).toHaveValue('');
        expect(screen.getByPlaceholderText(/Enter e-mail/i)).toHaveValue('');
    });

    test('updates input fields correctly', () => {
        render(<Create />);
        
        
        fireEvent.change(screen.getByPlaceholderText(/Enter name/i), { target: { value: 'Devaki' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter e-mail/i), { target: { value: 'pkudewakie@gmail.com' } });
        

    });
});
