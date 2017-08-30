import tabbables from './tabbables';
import tabSort from './tabOrder';

const findFocusable = nodes =>
  [...nodes].filter(
    node => window.getComputedStyle(node, null).getPropertyValue('display') !== 'none',
  );

const orderByTabIndex = nodes =>
  nodes
    .map((node, index) => ({
      node: node,
      index: index,
      tabIndex: (+node.getAttribute('tabIndex')) || node.tabIndex
    }))
    .filter(data => data.tabIndex >= 0)
    .sort(tabSort);

export default (topNode) => {
  const focusable = orderByTabIndex(
    findFocusable(topNode.querySelectorAll(tabbables.join(',')))
  )[0];

  if (focusable) {
    const target = focusable.node;
    target.focus();
    if (target.contentWindow) {
      target.contentWindow.focus();
    }
  }
};
