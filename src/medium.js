import { createMedium, createSidecarMedium } from 'use-sidecar';

export const mediumFocus = createMedium(
  {},
  ({ target, currentTarget }) => ({ target, currentTarget }),
);
export const mediumBlur = createMedium();

export const mediumEffect = createMedium();

export const mediumSidecar = createSidecarMedium({
  async: true,
});
