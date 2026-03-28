import * as React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from './field';

describe('Field components', () => {
  it('renders a full field setup', () => {
    render(
      <Field>
        <FieldLabel>Username</FieldLabel>
        <FieldDescription>Choose a unique name.</FieldDescription>
        <FieldError errors={[{ message: 'Username is required' }]} />
      </Field>,
    );

    expect(screen.getByText('Username', { exact: true })).toBeInTheDocument();
    expect(screen.getByText(/choose a unique name/i)).toBeInTheDocument();
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
  });

  it('renders a fieldset with legend', () => {
    render(
      <FieldSet>
        <FieldLabel>Notifications</FieldLabel>
      </FieldSet>,
    );
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
  });
});
