import * as React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge';

describe('Badge component', () => {
  it('renders correctly with children', () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText(/new/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-slot', 'badge');
  });

  it('applies default variant styles', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText(/default/i);
    expect(badge).toHaveClass('bg-primary');
  });

  it('applies custom variant styles', () => {
    render(<Badge variant="destructive">Critical</Badge>);
    const badge = screen.getByText(/critical/i);
    expect(badge).toHaveClass('text-destructive');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-style">Badge</Badge>);
    const badge = screen.getByText(/badge/i);
    expect(badge).toHaveClass('custom-style');
  });
});
