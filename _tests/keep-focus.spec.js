import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import { expect } from 'chai';
import FocusLock from '../src';

describe('Focus restoration', () => {
  it('maintains focus on element removal', async () => {
    render(
      <FocusLock>
        <button type="button">test</button>
      </FocusLock>,
    );
    //
    expect(document.activeElement).to.be.equal(screen.getByRole('button'));
  });

  it.todo('selects closes element to restore focus');
});
