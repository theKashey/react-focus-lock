import React, { PropTypes } from 'react';
import withSideEffect from 'react-side-effect';
import focusInside from './focusInside';
import moveFocusInside from './setFocus';
import tabHook from './tabHook';

const FocusTrap = ({ children, onBlur }) => (
  <div onBlur={onBlur}>
    {children}
  </div>
);

FocusTrap.propTypes = {
  onBlur: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

let lastActiveTrap = 0;
const activateTrap = () => {
  if (lastActiveTrap) {
    const { observed, onActivation } = lastActiveTrap;
    if (observed && !focusInside(observed)) {
      onActivation();
      moveFocusInside(observed);
    }
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
  }
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
)(FocusTrap);
