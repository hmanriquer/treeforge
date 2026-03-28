import * as React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './skeleton';

describe('Skeleton component', () => {
  it('renders correctly', () => {
    const { container } = render(<Skeleton className="h-10 w-10" />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
