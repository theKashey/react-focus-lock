export default (a, b) => {
  const tabDiff = a.tabIndex - b.tabIndex;
  const indexDiff = a.index - b.index;

  if (tabDiff) {
    if (!a.tabIndex) return 1;
    if (!b.tabIndex) return -1;
  }

  return tabDiff || indexDiff;
};
