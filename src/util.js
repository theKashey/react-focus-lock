export function deferAction(action) {
  // Hidding setImmediate from Webpack to avoid inserting polyfill
  const setImmediate = window.setImmediate;
  if (typeof setImmediate !== 'undefined') {
    setImmediate(action);
  } else {
    setTimeout(action, 1);
  }
}

export const inlineProp = (name, value) => {
  const obj = {};
  obj[name] = value;
  return obj;
};
