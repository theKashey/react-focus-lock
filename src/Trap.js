import React, {PropTypes} from 'react';
import withSideEffect from 'react-side-effect';
import focusInside from './focusInside';
import moveFocusInside from './setFocus';

const FocusTrap = ({children, onBlur}) => (
  <div onBlur={onBlur}>
    {children}
  </div>
);

FocusTrap.propTypes = {
  onBlur: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

function reducePropsToState(propsList) {
  return propsList
    .filter(({disabled}) => !disabled)
    .slice(-1)[0];
}

let lastActiveTrap = 0;
const activateTrap = () => {
  if (lastActiveTrap) {
    const {observed, onActivation} = lastActiveTrap;
    if (observed && !focusInside(observed)) {
      onActivation();
      moveFocusInside(observed);
    }
  }
};

function handleStateChangeOnClient(trap) {
  lastActiveTrap = trap;
  if (trap) {
    activateTrap();
    setImmediate(activateTrap);
  }
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
)(FocusTrap);
