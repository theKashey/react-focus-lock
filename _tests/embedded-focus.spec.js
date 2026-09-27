import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { expect } from 'chai';
import FocusLock from '../src';

const settle = () => new Promise(resolve => setTimeout(resolve, 10));

describe('embedded focus ownership', () => {
  let host;
  afterEach(async () => {
    cleanup();
    await settle();
    host.remove();
  });

  ['iframe', 'shadow'].forEach((mode) => {
    const setup = () => {
      host = document.createElement(mode === 'iframe' ? 'iframe' : 'div');
      document.body.appendChild(host);
      const root = mode === 'iframe' ? host.contentDocument.body : host.attachShadow({ mode: 'open' });
      const doc = root.ownerDocument;
      const opener = doc.createElement('button');
      opener.textContent = 'Open';
      root.appendChild(opener);
      opener.focus();
      const container = doc.createElement('div');
      root.appendChild(container);
      const active = () => mode === 'iframe' ? doc.activeElement : root.activeElement;
      return { root, container, opener, active };
    };

    it(`${mode}: does not reclaim focus after an input blurs for text selection`, async () => {
      const { container, active } = setup();
      render(<FocusLock><input /><p>Selectable reference</p><button>Close</button></FocusLock>, { container });
      await settle();
      const input = container.querySelector('input');
      expect(active() === input).to.equal(true);
      act(() => input.blur());
      await settle();
      expect(active() === input).to.equal(false);
    });

    it(`${mode}: restores the actual nested opener`, async () => {
      const { container, active } = setup();
      const view = nested => <FocusLock><input /><button id="nested-opener">More</button>{nested && <FocusLock returnFocus><input id="inner" /></FocusLock>}</FocusLock>;
      const { rerender } = render(view(false), { container });
      await settle();
      const opener = container.querySelector('#nested-opener');
      act(() => opener.focus());
      rerender(view(true));
      await settle();
      expect(active() === container.querySelector('#inner')).to.equal(true);
      rerender(view(false));
      await settle();
      expect(active() === opener).to.equal(true);
    });
  });
});
