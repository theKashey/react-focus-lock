import { createMedium } from 'use-sidecar';

export const mediumFocus = createMedium(
  {},
  {},
  ({ target, currentTarget }) => ({ target, currentTarget }),
);
export const mediumBlur = createMedium({});

export const mediumEffect = createMedium({});
