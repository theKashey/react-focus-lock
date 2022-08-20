import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import { expect } from 'chai';
import FocusLock from '../src';

describe('React Testing Library tests', () => {
  it('works with RTL', async () => {
    render(
      <FocusLock>
        <button type="button">test</button>
      </FocusLock>,
    );
    //
    expect(document.activeElement).to.be.equal(screen.getByRole('button'));
  });
});
