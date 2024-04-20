import { exportSidecar } from 'use-sidecar';
import FocusTrap from './Trap.js';
import { mediumSidecar } from './medium.js';

export default exportSidecar(mediumSidecar, FocusTrap);
