import tabbables from './tabbables';
import tabSort from './tabOrder';

const isElementHidden = (computedStyle) => (
  computedStyle.getPropertyValue('display') === 'none' ||
  computedStyle.getPropertyValue('visibility') === 'hidden'
);

const isVisible = (node) => (
  (!node || node === document) ||
  (
    !isElementHidden(window.getComputedStyle(node, null)) &&
    isVisible(node.parentNode)
  )
);

const notHiddenInput = (node) =>
node.tagName !== 'INPUT' && node.type !== 'hidden';

const findFocusable = nodes =>
  [...nodes]
    .filter(node => isVisible(node))
    .filter(node => notHiddenInput(node));

const orderByTabIndex = nodes =>
  nodes
    .map((node, index) => ({
      node,
      index,
      tabIndex: node.tabIndex,
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
