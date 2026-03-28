import * as React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

// Mock ResizeObserver for Radix Popper
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('HoverCard component', () => {
  it('shows content on hover', async () => {
    render(
      <HoverCard openDelay={0}>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Card content</HoverCardContent>
      </HoverCard>,
    );

    const trigger = screen.getByText(/hover me/i);
    fireEvent.pointerEnter(trigger);
    fireEvent.pointerMove(trigger);

    await waitFor(() => {
      expect(screen.getByText(/card content/i)).toBeInTheDocument();
    });
  });
});
