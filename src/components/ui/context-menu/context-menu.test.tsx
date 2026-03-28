import * as React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './context-menu';

describe('ContextMenu component', () => {
  it('opens the menu on right-click', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    const trigger = screen.getByText(/right click here/i);
    fireEvent.contextMenu(trigger);

    await waitFor(() => {
      expect(screen.getByText(/copy/i)).toBeInTheDocument();
      expect(screen.getByText(/paste/i)).toBeInTheDocument();
    });
  });
});
