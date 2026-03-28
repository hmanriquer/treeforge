import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { toolbarActions } from './actions';
import { Toolbar } from './toolbar';

describe('Toolbar Component', () => {
  it('renders the main toolbar container', () => {
    render(<Toolbar />);
    expect(screen.getByTestId('main-toolbar')).toBeInTheDocument();
  });

  it('renders the left section and search input', () => {
    render(<Toolbar />);
    expect(screen.getByTestId('toolbar-left')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search repositories or commits...'),
    ).toBeInTheDocument();
  });

  it('renders all dynamic toolbar actions from actions.tsx', () => {
    render(<Toolbar />);
    toolbarActions.forEach((action) => {
      expect(
        screen.getByRole('button', { name: new RegExp(action.label, 'i') }),
      ).toBeInTheDocument();
    });
  });

  it('renders the right section with Sync and Commit buttons', () => {
    render(<Toolbar />);
    expect(screen.getByTestId('toolbar-right')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Sync/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Commit/i })).toBeInTheDocument();
  });
});
