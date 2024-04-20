import { useContext, useMemo, useRef } from 'react';
import { focusScope } from './scope.js';
import { mediumEffect } from './medium.js';
import { extractRef } from './util.js';

const collapseRefs = shards => (
  shards.map(extractRef).filter(Boolean)
);

const withMedium = fn => new Promise(resolve => mediumEffect.useMedium((...args) => {
  resolve(fn(...args));
}));
export const useFocusController = (...shards) => {
  if (!shards.length) {
    throw new Error('useFocusController requires at least one target element');
  }
  const ref = useRef(shards);
  ref.current = shards;

  return useMemo(() => ({
    autoFocus(focusOptions = {}) {
      return withMedium(car => car.moveFocusInside(collapseRefs(ref.current), null, focusOptions));
    },
    focusNext(options) {
      return withMedium((car) => {
        car.moveFocusInside(collapseRefs(ref.current), null);
        car.focusNextElement(
          document.activeElement,
          { scope: collapseRefs(ref.current), ...options },
        );
      });
    },
    focusPrev(options) {
      return withMedium((car) => {
        car.moveFocusInside(collapseRefs(ref.current), null);
        car.focusPrevElement(
          document.activeElement,
          { scope: collapseRefs(ref.current), ...options },
        );
      });
    },
    focusFirst(options) {
      return withMedium((car) => {
        car.focusFirstElement(collapseRefs(ref.current), options);
      });
    },
    focusLast(options) {
      return withMedium((car) => {
        car.focusLastElement(collapseRefs(ref.current), options);
      });
    },
  }), []);
};
export const useFocusScope = () => {
  const scope = useContext(focusScope);
  if (!scope) {
    throw new Error('FocusLock is required to operate with FocusScope');
  }
  return useFocusController(scope.observed, ...scope.shards);
};
