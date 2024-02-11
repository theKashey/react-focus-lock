export function deferAction(action) {
  setTimeout(action, 1);
}

export const inlineProp = (name, value) => {
  const obj = {};
  obj[name] = value;
  return obj;
};

export const extractRef = ref => ((ref && 'current' in ref) ? ref.current : ref);
