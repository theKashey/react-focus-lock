import React from 'react';
import {
  render,
} from '@testing-library/react';
import { expect } from 'chai';
import { useFocusController } from '../src/UI';

describe('Hooks w/o sidecar', () => {
  it('controls focus', async () => {
    let control;
    const ref = React.createRef();
    const Capture = () => {
      control = useFocusController(ref);
      return null;
    };
    render(
      <div ref={ref}>
        <button id="b1">button1</button>
        <button id="b2">button2</button>
        <Capture />
      </div>,
    );
    expect(document.activeElement).to.be.equal(document.body);
    const p = control.autoFocus();
    // async
    expect(document.activeElement).to.be.equal(document.body);
    await p;
    expect(document.activeElement).to.be.equal(document.getElementById('b1'));
  });
});
