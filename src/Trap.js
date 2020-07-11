import * as React from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-clientside-effect';
import moveFocusInside, { focusInside, focusIsHidden, getFocusabledIn } from 'focus-lock';
import { deferAction } from './util';
import { mediumFocus, mediumBlur, mediumEffect } from './medium';

const focusOnBody = () => (
  document && document.activeElement === document.body
);

const isFreeFocus = () => focusOnBody() || focusIsHidden();

let lastActiveTrap = null;
let lastActiveFocus = null;

let lastPortaledElement = null;

let focusWasOutsideWindow = false;

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

function autoGuard(startIndex, end, step, allNodes) {
  let lastGuard = null;
  let i = startIndex;
  do {
    const item = allNodes[i];
    if (item.guard) {
      if (item.node.dataset.focusAutoGuard) {
        lastGuard = item;
      }
    } else if (item.lockItem) {
      if (i !== startIndex) {
        // we will tab to the next element
        return;
      }
      lastGuard = null;
    } else {
      break;
    }
  } while ((i += step) !== end);
  if (lastGuard) {
    lastGuard.node.tabIndex = 0;
  }
}

const extractRef = ref => ((ref && 'current' in ref) ? ref.current : ref);

const focusWasOutside = (crossFrameOption) => {
  if (crossFrameOption) {
    // with cross frame return true for any value
    return Boolean(focusWasOutsideWindow);
  }
  // in other case return only of focus went a while aho
  return focusWasOutsideWindow === 'meanwhile';
};

const activateTrap = () => {
  let result = false;
  if (lastActiveTrap) {
    const {
      observed, persistentFocus, autoFocus, shards, crossFrame,
    } = lastActiveTrap;
    const workingNode = observed || (lastPortaledElement && lastPortaledElement.portaledElement);
    const activeElement = document && document.activeElement;
    if (workingNode) {
      const workingArea = [
        workingNode,
        ...shards.map(extractRef).filter(Boolean),
      ];

      if (!activeElement || focusWhitelisted(activeElement)) {
        if (
          (persistentFocus || focusWasOutside(crossFrame))
          || !isFreeFocus()
          || (!lastActiveFocus && autoFocus)
        ) {
          if (
            workingNode
            && !(
              focusInside(workingArea)
              || focusIsPortaledPair(activeElement, workingNode)
            )
          ) {
            if (document && !lastActiveFocus && activeElement && !autoFocus) {
              // Check if blur() exists, which is missing on certain elements on IE
              if (activeElement.blur) {
                activeElement.blur();
              }
              document.body.focus();
            } else {
              result = moveFocusInside(workingArea, lastActiveFocus);
              lastPortaledElement = {};
            }
          }
          focusWasOutsideWindow = false;
          lastActiveFocus = document && document.activeElement;
        }
      }

      if (document) {
        const newActiveElement = document && document.activeElement;
        const allNodes = getFocusabledIn(workingArea);
        const focusedIndex = allNodes.map(({ node }) => node).indexOf(newActiveElement);
        if (focusedIndex > -1) {
          // remove old focus
          allNodes
            .filter(({ guard, node }) => guard && node.dataset.focusAutoGuard)
            .forEach(({ node }) => node.removeAttribute('tabIndex'));

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

const onBlur = () => (
  deferAction(activateTrap)
);

const onFocus = (event) => {
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

const onWindowBlur = () => {
  focusWasOutsideWindow = 'just';
  // using setTimeout to set  this variable after React/sidecar reaction
  setTimeout(() => {
    focusWasOutsideWindow = 'meanwhile';
  }, 0);
};

const attachHandler = () => {
  document.addEventListener('focusin', onTrap, true);
  document.addEventListener('focusout', onBlur);
  window.addEventListener('blur', onWindowBlur);
};

const detachHandler = () => {
  document.removeEventListener('focusin', onTrap, true);
  document.removeEventListener('focusout', onBlur);
  window.removeEventListener('blur', onWindowBlur);
};

function reducePropsToState(propsList) {
  return propsList
    .filter(({ disabled }) => !disabled);
}

function handleStateChangeOnClient(traps) {
  const trap = traps.slice(-1)[0];
  if (trap && !lastActiveTrap) {
    attachHandler();
  }

  const lastTrap = lastActiveTrap;
  const sameTrap = lastTrap && trap && trap.id === lastTrap.id;

  lastActiveTrap = trap;

  if (lastTrap && !sameTrap) {
    lastTrap.onDeactivation();
    // return focus only of last trap was removed
    if (!traps.filter(({ id }) => id === lastTrap.id).length) {
      // allow defer is no other trap is awaiting restore
      lastTrap.returnFocus(!trap);
    }
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

// bind medium
mediumFocus.assignSyncMedium(onFocus);
mediumBlur.assignMedium(onBlur);
mediumEffect.assignMedium(cb => cb({
  moveFocusInside,
  focusInside,
}));

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
)(FocusWatcher);
