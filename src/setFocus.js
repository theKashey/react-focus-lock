import tabbables from './tabbables';
import tabSort from './tabOrder';

const findFocusable = nodes =>
  [...nodes].filter(
    node => window.getComputedStyle(node, null).getPropertyValue('display') !== 'none',
  );

const orderByTabIndex = nodes =>
  nodes
    .map((node, index) => ({
      node,
      index,
      tabIndex: (+node.getAttribute('tabIndex')) || node.tabIndex,
    }))
    .filter(data => data.tabIndex >= 0)
    .sort(tabSort);

export const getTabbableNodes = topNode =>
  orderByTabIndex(
    findFocusable(topNode.querySelectorAll(tabbables.join(','))),
  );

export const focusOn = (target) => {
  target.focus();
  if (target.contentWindow) {
    target.contentWindow.focus();
  }
};

export default (topNode) => {
  const focusable = getTabbableNodes(topNode)[0];

  if (focusable) {
    focusOn(focusable.node);
  }
};
