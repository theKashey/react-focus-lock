import React from 'react';
import {
  render,
} from '@testing-library/react';
import { expect } from 'chai';
import FocusLock from '../src';
import { deferAction } from '../src/util';

describe('Focus restoration', async () => {
  it('maintains focus on element removal', async () => {
    const { rerender } = render(
      <FocusLock>
        <button type="button" key={1}>btn1</button>
      </FocusLock>,
    );
    //
    expect(document.activeElement.innerHTML).to.be.equal('btn1');

    rerender(
      <FocusLock>
        <button type="button" key={2}>new button</button>
      </FocusLock>,
    );

    // wait
    await new Promise(deferAction);

    expect(document.activeElement.innerHTML).to.be.equal('new button');
  });

  it('handles disabled elements', async () => {
    const { rerender } = render(
      <FocusLock>
        <button type="button">btn1</button>
        <button type="button">btn2</button>
      </FocusLock>,
    );
    //
    expect(document.activeElement.innerHTML).to.be.equal('btn1');


    // https://github.com/jsdom/jsdom/issues/3029 - jsdom does trigger blur on disabled
    document.activeElement.blur();
    document.body.focus();

    rerender(
      <FocusLock>
        <button type="button" disabled>btn1</button>
        <button type="button">btn2</button>
      </FocusLock>,
    );

    // wait
    await new Promise(deferAction);

    expect(document.activeElement.innerHTML).to.be.equal('btn2');
  });

  it('moves focus to the nearest element', async () => {
    render(
      <FocusLock>
        <button type="button">btn1</button>
        <button type="button">btn2</button>
        <button type="button" id="middle-button">btn3</button>
        <button type="button">btn4</button>
        <button type="button">btn5</button>
      </FocusLock>,
    );
    //
    const middleButton = document.getElementById('middle-button');
    middleButton.focus();
    expect(document.activeElement).to.be.equal(middleButton);

    middleButton.parentElement.removeChild(middleButton);
    // wait
    await new Promise(deferAction);

    // btn4 "replaces" bnt3 in visual order
    expect(document.activeElement.innerHTML).to.be.equal('btn4');
  });

  it('moves focus to the nearest element before', async () => {
    render(
      <FocusLock>
        <button type="button">btn1</button>
        <button type="button">btn2</button>
        <button type="button" id="middle-button">btn3</button>
      </FocusLock>,
    );
    //
    const middleButton = document.getElementById('middle-button');
    middleButton.focus();
    expect(document.activeElement).to.be.equal(middleButton);

    middleButton.parentElement.removeChild(middleButton);
    // wait
    await new Promise(deferAction);

    // btn2 is just before bnt3
    expect(document.activeElement.innerHTML).to.be.equal('btn2');
  });
});
