export const tabSort = (a, b) => {
  const tabDiff = a.tabIndex - b.tabIndex;
  const indexDiff = a.index - b.index;

  if (tabDiff) {
    if (!a.tabIndex) return 1;
    if (!b.tabIndex) return -1;
  }

  return tabDiff || indexDiff;
};

export const orderByTabIndex = nodes =>
  [...nodes]
    .map((node, index) => ({
      node,
      index,
      tabIndex: node.tabIndex,
    }))
    .filter(data => data.tabIndex >= 0)
    .sort(tabSort);
