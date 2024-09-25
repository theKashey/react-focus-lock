import { useContext, useMemo, useRef } from "react";
import { focusScope } from "./scope";
import { mediumEffect } from "./medium";
import { extractShards } from "./util";
import { FocusControl } from "./types";
import { focusLockAPI } from "./Trap";
import { Shards } from "./interfaces";

const withMedium = (fn: (car: typeof focusLockAPI) => void): Promise<void> =>
  new Promise((resolve) =>
    mediumEffect.useMedium((...args) => {
      resolve(fn(...args));
    })
  );

export const useFocusController = (...shards: Shards): FocusControl => {
  if (!shards.length) {
    throw new Error("useFocusController requires at least one target element");
  }
  const ref = useRef(shards);
  ref.current = shards;

  return useMemo(
    () => ({
      autoFocus(focusOptions = {}) {
        return withMedium((car: typeof focusLockAPI) =>
          car.moveFocusInside(extractShards(ref.current), null, focusOptions)
        );
      },
      focusNext(options) {
        return withMedium((car: typeof focusLockAPI) => {
          car.moveFocusInside(extractShards(ref.current), null);
          car.focusNextElement(document.activeElement, {
            scope: extractShards(ref.current),
            ...options,
          });
        });
      },
      focusPrev(options) {
        return withMedium((car: typeof focusLockAPI) => {
          car.moveFocusInside(extractShards(ref.current), null);
          car.focusPrevElement(document.activeElement, {
            scope: extractShards(ref.current),
            ...options,
          });
        });
      },
      focusFirst(options) {
        return withMedium((car: typeof focusLockAPI) => {
          car.focusFirstElement(extractShards(ref.current), options);
        });
      },
      focusLast(options) {
        return withMedium((car: typeof focusLockAPI) => {
          car.focusLastElement(extractShards(ref.current), options);
        });
      },
    }),
    []
  );
};

export const useFocusScope = (): FocusControl => {
  const scope = useContext(focusScope);
  if (!scope) {
    throw new Error("FocusLock is required to operate with FocusScope");
  }
  return useFocusController(scope.observed, ...scope.shards);
};
