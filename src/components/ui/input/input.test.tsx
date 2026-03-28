import * as React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from './input';

describe('Input component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText(/type here/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-slot', 'input');
  });

  it('handles value changes', () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText(/type here/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
