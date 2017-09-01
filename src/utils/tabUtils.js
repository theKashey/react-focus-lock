import tabbables from './tabbables';

export const getFocusables = parent => parent.querySelectorAll(tabbables.join(','));
