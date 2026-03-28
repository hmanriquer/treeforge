import * as React from 'react';

import { render, screen } from '@testing-library/react';
import { Info } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert component', () => {
  it('renders with title and description', () => {
    render(
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>This is a test alert.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByText(/heads up!/i)).toBeInTheDocument();
    expect(screen.getByText(/this is a test alert/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
      </Alert>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('text-destructive');
  });
});
