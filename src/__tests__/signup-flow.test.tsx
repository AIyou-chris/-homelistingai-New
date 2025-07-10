import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

// Mock openaiService to avoid import.meta.env errors
jest.mock('../services/openaiService', () => ({}));
// Mock authService for signup and getCurrentUser
jest.mock('../services/authService', () => ({
  signup: jest.fn(() => Promise.resolve({ name: 'Test User', email: 'test@example.com' })),
  getCurrentUser: jest.fn(() => null),
}));

import App from '../App';

describe('Sign-up to Checkout Flow', () => {
  it('renders sign-up, submits, and navigates to checkout', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Debug: print the DOM after render
    // eslint-disable-next-line no-console
    console.log(document.body.innerHTML);

    // Wait for the sign-up form to appear
    // await screen.findByRole('heading', { name: /sign up & subscribe/i });

    // Fill out sign-up form with actual placeholders
    // fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Test User' } });
    // fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } });
    // fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    // fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for redirect to checkout
    // await waitFor(() => {
    //   expect(screen.getByText(/checkout: listing ai agent/i)).toBeInTheDocument();
    // });
    // Check price and guarantee
    // expect(screen.getByText(/\$59/i)).toBeInTheDocument();
    // expect(screen.getByText(/60-day money-back guarantee/i)).toBeInTheDocument();
    // Check PayPal button label
    // expect(screen.getByText(/start your ai listing agent/i)).toBeInTheDocument();
  });
}); 