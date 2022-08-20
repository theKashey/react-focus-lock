import { sidecar } from 'use-sidecar';

import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import { expect } from 'chai';
import FocusLock from '../src/UI';

describe('Sidecar', () => {
// prefetch sidecar. data would be loaded, but js would not be executed
  const FocusLockSidecar = sidecar(
    () => new Promise(r => setTimeout(() => r(import('../src/sidecar')), 100)),
  );

  // FIXME: sidecar needs a custom SSR override to run this test
  it.skip('properly handles dynamic sidecar', async () => {
    let resolve;
    const lock = new Promise((res) => {
      resolve = res;
    });
    render(
      <FocusLock
        onActivation={() => resolve()}
        sideCar={FocusLockSidecar}
      >
        <button type="button">test</button>
      </FocusLock>,
    );
    await lock;
    //
    expect(document.activeElement).to.be.equal(screen.getByRole('button'));
  });
});
