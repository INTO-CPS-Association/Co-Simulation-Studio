import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import  BoundedDifferenceComponent  from './bounded-difference';

describe('BoundedDifferenceComponent', () => {

  const sampleProps = {
    constraint: {
      id: '12345',
      ports: ['port1', 'port2'],
      abstol: 0.1,
      reltol: 0.1,
      safety: 0.5,
      skipDiscrete: true
    },
    ports: ['port1', 'port2', 'port3'],
    formGroup: {},
    editing: true
  };

  //------------TESTS-----------------
  it('should render without crashing', () => {
    const { getByText } = render(<BoundedDifferenceComponent {...sampleProps} />);
    expect(screen.getByText(/Ports/)).toBeInTheDocument();
  });

  it('adds a port when "Add" button is clicked', () => {
    render(<BoundedDifferenceComponent {...sampleProps} />);
    const addButton = screen.getByText(/Add/);
    fireEvent.click(addButton);
    // Add assertions here to check the behavior
  });

  // Add more tests as needed
});

