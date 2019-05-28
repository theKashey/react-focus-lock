import {createMedium} from "use-sidecar";

export const mediumEffect = createMedium({});
export const mediumFocus = createMedium({}, {}, ({target, currentTarget}) => ({target, currentTarget}));
export const mediumBlur = createMedium({});