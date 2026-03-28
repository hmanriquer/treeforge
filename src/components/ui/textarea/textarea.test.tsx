import * as React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Textarea } from './textarea';

describe('Textarea component', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Type your message here." />);
    expect(
      screen.getByPlaceholderText('Type your message here.'),
    ).toBeInTheDocument();
  });
});
