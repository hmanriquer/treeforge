import * as React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FileIcon } from './file-icon';

describe('FileIcon component', () => {
  it('renders the correct icon for common extensions', () => {
    const { container: tsxContainer } = render(<FileIcon filename="App.tsx" />);
    // Check for FaReact (or at least that it's not the default File icon)
    // FaReact usually has a specific color class
    expect(tsxContainer.firstChild).toHaveClass('text-blue-400');

    const { container: jsContainer } = render(
      <FileIcon filename="script.js" />,
    );
    expect(jsContainer.firstChild).toHaveClass('text-yellow-400');
  });

  it('renders the correct icon for exact matches', () => {
    const { container } = render(<FileIcon filename="Dockerfile" />);
    expect(container.firstChild).toHaveClass('text-blue-500');
  });

  it('falls back to default icon for unknown extensions', () => {
    const { container } = render(<FileIcon filename="mystery.xyz" />);
    expect(container.firstChild).toHaveClass('text-slate-500');
  });
});
