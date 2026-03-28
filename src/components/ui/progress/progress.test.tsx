import * as React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Progress } from './progress';

describe('Progress component', () => {
  it('renders correctly', () => {
    render(<Progress value={45} data-testid="progress-bar" />);

    const progress = screen.getByTestId('progress-bar');
    expect(progress).toBeInTheDocument();
  });
});
