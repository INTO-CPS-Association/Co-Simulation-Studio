import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from './App';

it('renders "Welcome to Your Fluent UI App"', () => {
  render(<Form />);
  const linkElement = screen.getByText(/Welcome to Your Fluent UI App/i);
  expect(linkElement).toBeInTheDocument();
});
