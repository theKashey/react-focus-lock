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
  captureFocusRestore as captureRestore,
  getTabbableNodes,
} from 'focus-lock';
import { deferAction, extractRef } from './util';
import { getActiveElement, getOwnerDocument } from './focusContext';
import { mediumFocus, mediumBlur, mediumEffect } from './medium';

// The dependency's restore search uses Document.contains, which excludes shadow
// descendants. Keep its normal relocation behavior, but retain a live shadow
// target when that search cannot reach it.
const captureFocusRestore = (target) => {
  const restore = captureRestore(target);
  return () => restore() || (
    target && target.isConnected && target.getRootNode().host
      && getTabbableNodes([target.parentNode], new Map()).some(({ node }) => node === target)
      ? target
      : undefined
  );
};

const focusOnBody = ownerDocument => (
  !getActiveElement(ownerDocument) || getActiveElement(ownerDocument) === ownerDocument.body
);

const isFreeFocus = ownerDocument => focusOnBody(ownerDocument) || focusIsHidden(ownerDocument);

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

    const ownerDocument = getOwnerDocument(workingNode);

    // check if lastActiveFocus is still reachable
    if (focusOnBody(ownerDocument) && lastActiveFocus && lastActiveFocus !== ownerDocument.body) {
      if (
        // it was removed
        !lastActiveFocus.isConnected
          // or not focusable (this is expensive operation)!
          || isNotFocusable(lastActiveFocus)
      ) {
        const newTarget = tryRestoreFocus();
        if (newTarget) {
          newTarget.focus();
        }
      }
    }

    const activeElement = getActiveElement(ownerDocument);
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
          || !isFreeFocus(ownerDocument)
          || (!lastActiveFocus && autoFocus)
        ) {
          if (
            workingNode
            && !(
              // active element is "inside" working area
              (focusInside(workingArea, activeElement) || (
                // Closed shadow roots cannot be traversed from document.activeElement.
                activeElement && withinHost(activeElement, workingArea)
              ))
              || focusIsPortaledPair(activeElement, workingNode)
            )
          ) {
            // in case there no yet selected element(first activation),
            // but there is some active element
            // and autofocus is off
            // - we blur currently active element and move focus to the body
            if (!lastActiveFocus && activeElement && !autoFocus) {
              // Check if blur() exists, which is missing on certain elements on IE
              if (activeElement.blur) {
                activeElement.blur();
              }
              ownerDocument.body.focus();
            } else {
              result = moveFocusInside(workingArea, lastActiveFocus, { focusOptions });
              lastPortaledElement = {};
            }
          }
          lastActiveFocus = getActiveElement(ownerDocument);
          if (lastActiveFocus && lastActiveFocus !== ownerDocument.body) {
            tryRestoreFocus = captureFocusRestore(lastActiveFocus);
          }
          focusWasOutsideWindow = false;
        }
      }

      if (ownerDocument
          // element was changed by moveFocusInside
          && activeElement !== getActiveElement(ownerDocument)
          // fast check for any auto-guard
          && workingNode.getRootNode().querySelector('[data-focus-auto-guard]')) {
        const newActiveElement = getActiveElement(ownerDocument);
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

let observedDocument;

const attachHandler = (ownerDocument) => {
  observedDocument = ownerDocument;
  observedDocument.addEventListener('focusin', onTrap);
  observedDocument.addEventListener('focusout', onBlur);
  observedDocument.defaultView.addEventListener('focus', onWindowFocus);
  observedDocument.defaultView.addEventListener('blur', onWindowBlur);
};

const detachHandler = () => {
  if (!observedDocument) {
    return;
  }
  observedDocument.removeEventListener('focusin', onTrap);
  observedDocument.removeEventListener('focusout', onBlur);
  observedDocument.defaultView.removeEventListener('focus', onWindowFocus);
  observedDocument.defaultView.removeEventListener('blur', onWindowBlur);
  observedDocument = null;
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
  if (trap && observedDocument !== getOwnerDocument(trap.observed)) {
    detachHandler();
    attachHandler(getOwnerDocument(trap.observed));
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
