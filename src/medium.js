import { createMedium, createSidecarMedium } from 'use-sidecar';

export const mediumFocus = createMedium(
  {},
  ({ target, currentTarget }) => ({ target, currentTarget }),
);
export const mediumBlur = createMedium();

export const mediumEffect = createMedium();

export const mediumSidecar = createSidecarMedium({
  async: true,
  // focus-lock sidecar is not required on the server
  // however, it might be required for JSDOM tests
  ssr: typeof document !== 'undefined',
});
