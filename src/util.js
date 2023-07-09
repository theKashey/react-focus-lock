export function deferAction(action) {
  setTimeout(action, 1);
}

export const inlineProp = (name, value) => {
  const obj = {};
  obj[name] = value;
  return obj;
};
