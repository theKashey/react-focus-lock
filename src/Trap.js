import React from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-clientside-effect';
import moveFocusInside, {focusInside, focusIsHidden, getFocusabledIn} from 'focus-lock';
import {deferAction} from './util';

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
  lastPortaledElement = {observerNode, portaledElement};
};

const focusIsPortaledPair = element => (
  lastPortaledElement && lastPortaledElement.portaledElement === element
);

function autoGuard(startIndex, end, step, allNodes) {
  let lastGuard = null;
  let i = startIndex;
  do {
    const node = allNodes[i];
    if (node.guard) {
      lastGuard = node;
    } else if (node.lockItem) {
      lastGuard = null;
    } else {
      break;
    }
  } while ((i += step) !== end);
  if (lastGuard) {
    lastGuard.node.tabIndex = 0;
  }
}

const activateTrap = () => {
  let result = false;
  if (lastActiveTrap) {
    const {observed, persistentFocus, autoFocus, shards} = lastActiveTrap;
    const workingNode = observed || (lastPortaledElement && lastPortaledElement.portaledElement);
    const activeElement = document && document.activeElement;
    if (workingNode) {
      const workingArea = [workingNode, ...shards.map(({current}) => current)];

      if (!activeElement || focusWhitelisted(activeElement)) {
        if (persistentFocus || !isFreeFocus() || (!lastActiveFocus && autoFocus)) {
          if (
            workingNode &&
            !(
              focusInside(workingArea) ||
              focusIsPortaledPair(activeElement, workingNode)
            )
          ) {
            if (document && !lastActiveFocus && activeElement && !autoFocus) {
              activeElement.blur();
              document.body.focus();
            } else {
              result = moveFocusInside(workingArea, lastActiveFocus);
              lastPortaledElement = {};
            }
          }
          lastActiveFocus = document && document.activeElement;
        }
      }

      if (document) {
        const newActiveElement = document && document.activeElement;
        const allNodes = getFocusabledIn(workingArea);
        const focusedItem = allNodes.find(({node}) => node === newActiveElement);
        if (focusedItem) {
          // remove old focus
          allNodes
            .filter(({guard, node}) => guard && node.dataset.focusAutoGuard)
            .forEach(({node}) => node.removeAttribute('tabIndex'));

          const focusedIndex = allNodes.indexOf(focusedItem);
          autoGuard(focusedIndex, allNodes.length, +1, allNodes);
          autoGuard(focusedIndex, -1, -1, allNodes);
        }
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

const FocusTrap = ({children}) => (
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
    .filter(({disabled}) => !disabled)
    .slice(-1)[0];
}

function handleStateChangeOnClient(trap) {
  if (trap && !lastActiveTrap) {
    attachHandler();
  }

  const lastTrap = lastActiveTrap;
  const sameTrap = lastTrap && trap && trap.onActivation === lastTrap.onActivation;

  lastActiveTrap = trap;

  if (lastTrap && !sameTrap) {
    lastTrap.onDeactivation();
  }

  if (trap) {
    lastActiveFocus = null;
    if (!sameTrap || lastTrap.observed !== trap.observed) {
      trap.onActivation();
    }
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
