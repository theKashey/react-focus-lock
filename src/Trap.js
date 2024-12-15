/* eslint-disable no-mixed-operators */
import React from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-clientside-effect';
import {
  moveFocusInside, focusInside,
  focusIsHidden,
  expandFocusableNodes,
  getFocusableNodes,
  focusNextElement,
  focusPrevElement,
  focusFirstElement,
  focusLastElement,
  captureFocusRestore,
} from 'focus-lock';
import { deferAction, extractRef } from './util';
import { mediumFocus, mediumBlur, mediumEffect } from './medium';

const focusOnBody = () => (
  document && document.activeElement === document.body
);

const isFreeFocus = () => focusOnBody() || focusIsHidden();

let lastActiveTrap = null;
let lastActiveFocus = null;
let tryRestoreFocus = () => null;

let lastPortaledElement = null;

let focusWasOutsideWindow = false;
let windowFocused = false;

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

const focusWasOutside = (crossFrameOption) => {
  if (crossFrameOption) {
    // with cross frame return true for any value
    return Boolean(focusWasOutsideWindow);
  }
  // in other case return only of focus went a while aho
  return focusWasOutsideWindow === 'meanwhile';
};

const checkInHost = (check, el, boundary) => (
  el && (
  // find host equal to active element and check nested active element
    (el.host === check && (!el.activeElement || boundary.contains(el.activeElement))
  // dive up
  || (el.parentNode && checkInHost(check, el.parentNode, boundary))))
);

const withinHost = (activeElement, workingArea) => (
  workingArea.some(area => checkInHost(activeElement, area, area))
);

const getNodeFocusables = nodes => getFocusableNodes(nodes, new Map());
const isNotFocusable = node => (
  !getNodeFocusables([node.parentNode]).some(el => el.node === node)
);

const activateTrap = () => {
  let result = false;
  if (lastActiveTrap) {
    const {
      observed, persistentFocus, autoFocus, shards, crossFrame, focusOptions, noFocusGuards,
    } = lastActiveTrap;
    const workingNode = observed || (lastPortaledElement && lastPortaledElement.portaledElement);

    // check if lastActiveFocus is still reachable
    if (focusOnBody() && lastActiveFocus && lastActiveFocus !== document.body) {
      if (
        // it was removed
        !document.body.contains(lastActiveFocus)
          // or not focusable (this is expensive operation)!
          || isNotFocusable(lastActiveFocus)
      ) {
        const newTarget = tryRestoreFocus();
        if (newTarget) {
          newTarget.focus();
        }
      }
    }

    const activeElement = document && document.activeElement;
    if (workingNode) {
      const workingArea = [
        workingNode,
        ...shards.map(extractRef).filter(Boolean),
      ];

      const shouldForceRestoreFocus = () => {
        // force restoration happens when
        // - focus is not inside now
        // - focusWasOutside
        // - there are go guards
        // - the last active element was the first or the last focusable one
        if (!focusWasOutside(crossFrame) || !noFocusGuards || !lastActiveFocus || windowFocused) {
          return false;
        }
        const nodes = getNodeFocusables(workingArea);
        const lastIndex = nodes.findIndex(({ node }) => node === lastActiveFocus);

        return lastIndex === 0 || lastIndex === nodes.length - 1;
      };

      if (!activeElement || focusWhitelisted(activeElement)) {
        if (
          (persistentFocus || shouldForceRestoreFocus())
          || !isFreeFocus()
          || (!lastActiveFocus && autoFocus)
        ) {
          if (
            workingNode
            && !(
              // active element is "inside" working area
              (focusInside(workingArea) || (
              // check for shadow-dom contained elements
                activeElement && withinHost(activeElement, workingArea))
              )
              || focusIsPortaledPair(activeElement, workingNode)
            )
          ) {
            // in case there no yet selected element(first activation),
            // but there is some active element
            // and autofocus is off
            // - we blur currently active element and move focus to the body
            if (document && !lastActiveFocus && activeElement && !autoFocus) {
              // Check if blur() exists, which is missing on certain elements on IE
              if (activeElement.blur) {
                activeElement.blur();
              }
              document.body.focus();
            } else {
              result = moveFocusInside(workingArea, lastActiveFocus, { focusOptions });
              lastPortaledElement = {};
            }
          }
          lastActiveFocus = document && document.activeElement;
          if (lastActiveFocus !== document.body) {
            tryRestoreFocus = captureFocusRestore(lastActiveFocus);
          }
          focusWasOutsideWindow = false;
        }
      }

      if (document
          // element was changed by moveFocusInside
          && activeElement !== document.activeElement
          // fast check for any auto-guard
          && document.querySelector('[data-focus-auto-guard]')) {
        const newActiveElement = document && document.activeElement;
        const allNodes = expandFocusableNodes(workingArea);
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

const onWindowFocus = () => {
  windowFocused = true;
};
const onWindowBlur = () => {
  windowFocused = false;
  focusWasOutsideWindow = 'just';
  // using setTimeout to set  this variable after React/sidecar reaction
  deferAction(() => {
    focusWasOutsideWindow = 'meanwhile';
  });
};

const attachHandler = () => {
  document.addEventListener('focusin', onTrap);
  document.addEventListener('focusout', onBlur);
  window.addEventListener('focus', onWindowFocus);
  window.addEventListener('blur', onWindowBlur);
};

const detachHandler = () => {
  document.removeEventListener('focusin', onTrap);
  document.removeEventListener('focusout', onBlur);
  window.removeEventListener('focus', onWindowFocus);
  window.removeEventListener('blur', onWindowBlur);
};

function reducePropsToState(propsList) {
  return propsList
    .filter(({ disabled }) => !disabled);
}

const focusLockAPI = {
  moveFocusInside,
  focusInside,
  focusNextElement,
  focusPrevElement,
  focusFirstElement,
  focusLastElement,
  captureFocusRestore,
};

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
      trap.onActivation(focusLockAPI);
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
mediumEffect.assignMedium(cb => cb(focusLockAPI));

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
)(FocusWatcher);
