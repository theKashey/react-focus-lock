import { createMedium, createSidecarMedium } from "use-sidecar";
import { focusLockAPI } from "./Trap";

export interface FocusEventLite {
  target: EventTarget & Element;
  currentTarget: EventTarget & Element;
}

export const mediumFocus = createMedium<FocusEventLite>(
  undefined,
  (event: FocusEventLite) => ({
    target: event.target,
    currentTarget: event.currentTarget,
  })
);
export const mediumBlur = createMedium<() => void>();

export const mediumEffect = createMedium<(api: typeof focusLockAPI) => void>();

export const mediumSidecar = createSidecarMedium({
  async: true,
  // focus-lock sidecar is not required on the server
  // however, it might be required for JSDOM tests
  ssr: typeof document !== "undefined",
});
