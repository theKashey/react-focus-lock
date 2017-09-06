import React, { PropTypes } from 'react';
import withSideEffect from 'react-side-effect';
import moveFocusInside, { focusInside, tabHook } from 'focus-lock';

const FocusTrap = ({ children, onBlur, onFocus }) => (
  <div onBlur={onBlur} onFocus={onFocus}>
    {children}
  </div>
);

FocusTrap.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

let lastActiveTrap = 0;
let lastActiveFocus = null;
const activateTrap = () => {
  if (lastActiveTrap) {
    const { observed, onActivation } = lastActiveTrap;
    if (observed && !focusInside(observed)) {
      onActivation();
      moveFocusInside(observed, lastActiveFocus);
    }
    lastActiveFocus = document.activeElement;
  }
};

function reducePropsToState(propsList) {
  return propsList
    .filter(({ disabled }) => !disabled)
    .slice(-1)[0];
}

function handleStateChangeOnClient(trap) {
  lastActiveTrap = trap;
  if (trap) {
    tabHook.attach(trap.observed, trap.sandboxed);
    activateTrap();
    setImmediate(activateTrap);
  } else {
    tabHook.detach();
    lastActiveFocus = null;
  }
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
)(FocusTrap);
