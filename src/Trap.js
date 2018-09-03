import React from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-clientside-effect';
import moveFocusInside, { focusInside, focusIsHidden } from 'focus-lock';
import { deferAction } from './util';

const focusOnBody = () => (
  document && document.activeElement === document.body
);

const isFreeFocus = () => focusOnBody() || focusIsHidden();

let lastActiveTrap = null;
let lastActiveFocus = null;

let lastPortaledElement = null;

const defaultWhitelist = () => true;

const focusWhitelisted = activeElement => (
  (lastActiveTrap.whiteList || defaultWhitelist)(activeElement)
);

const recordPortal = (observerNode, portaledElement) => {
  lastPortaledElement = { observerNode, portaledElement };
};

const focusIsPortaledPair = element => (
  lastPortaledElement && lastPortaledElement.portaledElement === element
);

const activateTrap = () => {
  let result = false;
  if (lastActiveTrap) {
    const { observed, onActivation, persistentFocus, autoFocus } = lastActiveTrap;
    const workingNode = observed || (lastPortaledElement && lastPortaledElement.portaledElement);
    const activeElement = document && document.activeElement;

    if (!activeElement || focusWhitelisted(activeElement)) {
      if (persistentFocus || !isFreeFocus() || (!lastActiveFocus && autoFocus)) {
        if (
          workingNode &&
          !(
            focusInside(workingNode) ||
            focusIsPortaledPair(activeElement, workingNode)
          )
        ) {
          onActivation();
          if (document && !lastActiveFocus && activeElement && !autoFocus) {
            activeElement.blur();
            document.body.focus();
          } else {
            result = moveFocusInside(workingNode, lastActiveFocus);
            lastPortaledElement = {};
          }
        }
        lastActiveFocus = document && document.activeElement;
      }
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

export const onBlur = () => (
  deferAction(activateTrap)
);

export const onFocus = (event) => {
  // detect portal
  const source = event.target;
  const currentNode = event.currentTarget;
  if (!currentNode.contains(source)) {
    recordPortal(currentNode, source);
  }
};

const FocusWatcher = () => null;

const FocusTrap = ({ children }) => (
  <div onBlur={onBlur} onFocus={onFocus}>
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
)(FocusWatcher);
