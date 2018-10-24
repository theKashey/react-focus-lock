export function deferAction(action) {
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
