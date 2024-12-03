/**
 * @fileoverview this is a copy of https://github.com/ai/nanoevents
  a temp measure to avoid breaking changes in node/compilation
 */

export const createNanoEvents = () => ({
  emit(event, ...args) {
    for (
      let i = 0,
        callbacks = this.events[event] || [],
        { length } = callbacks;
      i < length;
    // eslint-disable-next-line no-plusplus
      i++
    ) {
      callbacks[i](...args);
    }
  },
  events: {},
  on(event, cb) {
    (this.events[event] ||= []).push(cb);
    return () => {
      this.events[event] = this.events[event]?.filter(i => cb !== i);
    };
  },
});
