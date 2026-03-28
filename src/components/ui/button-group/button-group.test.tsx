import * as React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ButtonGroup, ButtonGroupText } from './button-group';

describe('ButtonGroup component', () => {
  it('renders the button group correctly', () => {
    render(
      <ButtonGroup>
        <ButtonGroupText>Groups</ButtonGroupText>
        <button>Test</button>
      </ButtonGroup>,
    );

    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });

  it('applies vertical orientation', () => {
    render(
      <ButtonGroup orientation="vertical">
        <button>1</button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('group')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
  });
});
