/* eslint-disable no-mixed-operators */
import * as React from "react";
import PropTypes from "prop-types";
import withSideEffect from "react-clientside-effect";
import {
  moveFocusInside,
  focusInside,
  focusIsHidden,
  expandFocusableNodes,
  getFocusableNodes,
  focusNextElement,
  focusPrevElement,
  focusFirstElement,
  focusLastElement,
  captureFocusRestore,
} from "focus-lock";
import { deferAction, extractShards } from "./util";
import {
  mediumFocus,
  mediumBlur,
  mediumEffect,
  FocusEventLite,
} from "./medium";
import { Trap } from "./interfaces";

const focusOnBody = () => document && document.activeElement === document.body;

const isFreeFocus = () => focusOnBody() || focusIsHidden();

let lastActiveTrap: null | Trap = null;
let lastActiveFocus: null | HTMLElement = null;
let tryRestoreFocus: () => HTMLElement | undefined = () => undefined;

let lastPortaledElement: null | {
  observerNode: EventTarget & Element;
  portaledElement: EventTarget & Element;
} = null;

let focusWasOutsideWindow: false | "meanwhile" | "just" = false;
let windowFocused = false;

const defaultWhitelist = () => true;

const focusWhitelisted = (activeElement: HTMLElement) =>
  (lastActiveTrap!.whiteList || defaultWhitelist)(activeElement);

const recordPortal = (
  observerNode: EventTarget & Element,
  portaledElement: EventTarget & Element
) => {
  lastPortaledElement = { observerNode, portaledElement };
};

const focusIsPortaledPair = (element: Element) =>
  lastPortaledElement && lastPortaledElement.portaledElement === element;

interface FocusableNode {
  node: HTMLElement;
  /**
   * index in the tab order
   */
  index: number;
  /**
   * true, if this node belongs to a Lock
   */
  lockItem: boolean;
  /**
   * true, if this node is a focus-guard (system node)
   */
  guard: boolean;
}

function autoGuard(
  startIndex: number,
  end: number,
  step: number,
  allNodes: FocusableNode[]
) {
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

const focusWasOutside = (crossFrameOption: boolean) => {
  if (crossFrameOption) {
    // with cross frame return true for any value
    return Boolean(focusWasOutsideWindow);
  }
  // in other case return only of focus went a while aho
  return focusWasOutsideWindow === "meanwhile";
};

const checkInHost = (check: Node, el: any, boundary: Node): Node =>
  el &&
  // find host equal to active element and check nested active element
  ((el.host === check &&
    (!el.activeElement || boundary.contains(el.activeElement))) ||
    // dive up
    (el.parentNode && checkInHost(check, el.parentNode, boundary)));

const withinHost = (activeElement: HTMLElement, workingArea: HTMLElement[]) =>
  workingArea.some((area) => checkInHost(activeElement, area, area));

const getNodeFocusables = (nodes: Element[]) =>
  getFocusableNodes(nodes, new Map());
const isNotFocusable = (node: Element) =>
  !getNodeFocusables([node.parentNode as Element]).some(
    (el) => el.node === node
  );

const activateTrap = () => {
  let result = false;
  if (lastActiveTrap) {
    const {
      observed,
      persistentFocus,
      autoFocus,
      shards,
      crossFrame,
      focusOptions,
      noFocusGuards,
    } = lastActiveTrap;
    const workingNode =
      observed || (lastPortaledElement && lastPortaledElement.portaledElement);

    // check if lastActiveFocus is still reachable
    if (focusOnBody() && lastActiveFocus) {
      if (
        // it was removed
        !document.body.contains(lastActiveFocus) ||
        // or not focusable (this is expensive operation)!
        isNotFocusable(lastActiveFocus)
      ) {
        lastActiveFocus = null;

        const newTarget = tryRestoreFocus();
        if (newTarget) {
          newTarget.focus();
        }
      }
    }

    const activeElement = (document && document.activeElement) as HTMLElement;
    if (workingNode) {
      const workingArea = [workingNode, ...extractShards(shards)];

      const shouldForceRestoreFocus = () => {
        // force restoration happens when
        // - focus is not inside now
        // - focusWasOutside
        // - there are go guards
        // - the last active element was the first or the last focusable one
        if (
          !focusWasOutside(crossFrame) ||
          !noFocusGuards ||
          !lastActiveFocus ||
          windowFocused
        ) {
          return false;
        }
        const nodes = getNodeFocusables(workingArea);
        const lastIndex = nodes.findIndex(
          ({ node }) => node === lastActiveFocus
        );

        return lastIndex === 0 || lastIndex === nodes.length - 1;
      };

      if (!activeElement || focusWhitelisted(activeElement)) {
        if (
          persistentFocus ||
          shouldForceRestoreFocus() ||
          !isFreeFocus() ||
          (!lastActiveFocus && autoFocus)
        ) {
          if (
            workingNode &&
            !(
              // active element is "inside" working area
              (
                focusInside(workingArea) ||
                // check for shadow-dom contained elements
                (activeElement && withinHost(activeElement, workingArea)) ||
                focusIsPortaledPair(activeElement)
              )
            )
          ) {
            if (document && !lastActiveFocus && activeElement && !autoFocus) {
              // Check if blur() exists, which is missing on certain elements on IE
              if (activeElement.blur) {
                activeElement.blur();
              }
              document.body.focus();
            } else {
              result = moveFocusInside(workingArea, lastActiveFocus, {
                focusOptions,
              }) as any as boolean; // This is weird, the called function does not return anything.
              lastPortaledElement = null;
            }
          }
          focusWasOutsideWindow = false;
          lastActiveFocus = (document &&
            document.activeElement) as HTMLElement | null;
          tryRestoreFocus = captureFocusRestore(lastActiveFocus) as () =>
            | HTMLElement
            | undefined;
        }
      }

      if (
        document &&
        // element was changed by moveFocusInside
        activeElement !== document.activeElement &&
        // fast check for any auto-guard
        document.querySelector("[data-focus-auto-guard]")
      ) {
        const newActiveElement = (document &&
          document.activeElement) as HTMLElement;
        const allNodes = expandFocusableNodes(workingArea);
        const focusedIndex = allNodes
          .map(({ node }) => node)
          .indexOf(newActiveElement);
        if (focusedIndex > -1) {
          // remove old focus
          allNodes
            .filter(({ guard, node }) => guard && node.dataset.focusAutoGuard)
            .forEach(({ node }) => node.removeAttribute("tabIndex"));

          autoGuard(focusedIndex, allNodes.length, +1, allNodes);
          autoGuard(focusedIndex, -1, -1, allNodes);
        }
      }
    }
  }
  return result;
};

const onTrap = (event: FocusEvent) => {
  if (activateTrap() && event) {
    // prevent scroll jump
    event.stopPropagation();
    event.preventDefault();
  }
};

const onBlur = () => deferAction(activateTrap);

const onFocus = (event: FocusEventLite) => {
  // detect portal
  const source = event.target;
  const currentNode = event.currentTarget;
  if (!currentNode.contains(source)) {
    recordPortal(currentNode, source);
  }
};

const FocusWatcher = () => null;

const FocusTrap = ({ children }: { children: React.ReactNode }) => (
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
  focusWasOutsideWindow = "just";
  // using setTimeout to set  this variable after React/sidecar reaction
  deferAction(() => {
    focusWasOutsideWindow = "meanwhile";
  });
};

const attachHandler = () => {
  document.addEventListener("focusin", onTrap);
  document.addEventListener("focusout", onBlur);
  window.addEventListener("focus", onWindowFocus);
  window.addEventListener("blur", onWindowBlur);
};

const detachHandler = () => {
  document.removeEventListener("focusin", onTrap);
  document.removeEventListener("focusout", onBlur);
  window.removeEventListener("focus", onWindowFocus);
  window.removeEventListener("blur", onWindowBlur);
};

function reducePropsToState<T extends { disabled: boolean }>(propsList: T[]) {
  return propsList.filter(({ disabled }) => !disabled);
}

export const focusLockAPI = {
  moveFocusInside,
  focusInside,
  focusNextElement,
  focusPrevElement,
  focusFirstElement,
  focusLastElement,
  captureFocusRestore,
};

function handleStateChangeOnClient(traps: Trap[]) {
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
    activateTrap();
    deferAction(activateTrap);
  } else {
    detachHandler();
    lastActiveFocus = null;
  }
}

// bind medium
mediumFocus.assignSyncMedium(onFocus);
mediumBlur.assignMedium(onBlur);
mediumEffect.assignMedium((cb) => cb(focusLockAPI));

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(FocusWatcher);
