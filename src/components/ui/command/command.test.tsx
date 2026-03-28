import * as React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command';

// Mock scrollIntoView which is called by cmdk but not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = function () {};

describe('Command component', () => {
  it('renders correctly with search and items', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );

    expect(screen.getByPlaceholderText(/search.../i)).toBeInTheDocument();
    expect(screen.getByText(/calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/search emoji/i)).toBeInTheDocument();
  });

  it('filters items when typing in input', async () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem>Apple</CommandItem>
            <CommandItem>Banana</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );

    const input = screen.getByPlaceholderText(/search.../i);
    fireEvent.change(input, { target: { value: 'Apple' } });

    // "Banana" should be hidden (not in the DOM or aria-hidden)
    await waitFor(() => {
      expect(screen.getByText(/apple/i)).toBeVisible();
      expect(screen.queryByText(/banana/i)).not.toBeInTheDocument();
    });
  });
});
