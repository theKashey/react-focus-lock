import * as React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sidecar } from 'use-sidecar';
import FocusLock from '../src/UI';

const tick = (tm = 1) => new Promise(resolve => setTimeout(resolve, tm));

const FocusLockSidecar = sidecar(
  () => import('../src/sidecar').then(async (x) => {
    await tick();
    return x;
  }),
);

it('Should return focus to the possible place: timing', async () => {
  const LockTest = ({ action }) => (
    <FocusLock returnFocus sideCar={FocusLockSidecar}>
      <button data-testid="focus-action" onClick={action}>
        inside
      </button>
    </FocusLock>
  );

  const TriggerTest = () => {
    const [clicked, setClicked] = React.useState(false);
    return (
      <>
        {clicked ? null : <button data-testid="trigger" onClick={() => setClicked(true)}>trigger</button>}
        <button id="follower">another action</button>
        {clicked && (
        <LockTest
          action={() => { setClicked(false); }}
        />
        )}
      </>
    );
  };

  render(<TriggerTest />);

  screen.getByTestId('trigger').focus();
  await userEvent.click(screen.getByTestId('trigger'));
  await tick(5);
  expect(document.activeElement.innerHTML).to.be.equal('inside');
  await userEvent.click(screen.getByTestId('focus-action'));
  await tick();
  console.log('active is ', document.activeElement.tagName);
  expect(document.activeElement).to.be.equal(document.body);
});
