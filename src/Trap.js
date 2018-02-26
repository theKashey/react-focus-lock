import React from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-side-effect';
import moveFocusInside, { focusInside } from 'focus-lock';
import { deferAction } from './util';

const focusOnBody = () => document && document.activeElement === document.body;

let lastActiveTrap = 0;
let lastActiveFocus = null;
const activateTrap = () => {
  let result = false;
  if (lastActiveTrap) {
    const { observed, onActivation, persistentFocus, autoFocus } = lastActiveTrap;

    if (persistentFocus || !focusOnBody() || (!lastActiveFocus && autoFocus)) {
      if (observed && !focusInside(observed)) {
        onActivation();
        if (document && !lastActiveFocus && document.activeElement && !autoFocus) {
          document.activeElement.blur();
          document.body.focus();
        } else {
          result = moveFocusInside(observed, lastActiveFocus);
        }
      }
      lastActiveFocus = document && document.activeElement;
    }
  }
  return result;
};

const onTrap = (event) => {
  if (activateTrap() && event) {
    // prevent scroll jump
    event.stopPropagation();
    event.preventDefault();
  }
};

const onBlur = () => (
  deferAction(activateTrap)
);

const FocusTrap = ({ children }) => (
  <div onBlur={onBlur}>
    {children}
  </div>
);

FocusTrap.propTypes = {
  children: PropTypes.node.isRequired,
};

const attachHandler = () => {
  document.addEventListener('focusin', onTrap, true);
  document.addEventListener('focusout', onBlur);
};

const detachHandler = () => {
  document.removeEventListener('focusin', onTrap, true);
  document.removeEventListener('focusout', onBlur);
};


function reducePropsToState(propsList) {
  return propsList
    .filter(({ disabled }) => !disabled)
    .slice(-1)[0];
}

function handleStateChangeOnClient(trap) {
  if (trap && !lastActiveTrap) {
    attachHandler();
  }

  lastActiveTrap = trap;
  if (trap) {
    lastActiveFocus = null;
    activateTrap(true);
    deferAction(activateTrap);
  } else {
    detachHandler();
    lastActiveFocus = null;
  }
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
)(FocusTrap);
