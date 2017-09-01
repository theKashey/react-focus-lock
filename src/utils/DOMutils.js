import { orderByTabIndex } from './tabOrder';
import { getFocusables } from './tabUtils';

const isElementHidden = computedStyle => (
  computedStyle.getPropertyValue('display') === 'none' ||
  computedStyle.getPropertyValue('visibility') === 'hidden'
);

export const isVisible = node => (
  (!node || node === document) ||
  (
    !isElementHidden(window.getComputedStyle(node, null)) &&
    isVisible(node.parentNode)
  )
);

export const notHiddenInput = node => node.tagName !== 'INPUT' || node.type !== 'hidden';

const getParents = (node, parents = []) => {
  parents.push(node);
  if (node.parentNode) {
    getParents(node.parentNode, parents);
  }
  return parents;
};

export const getCommonParent = (nodea, nodeb) => {
  const parentsA = getParents(nodea);
  const parentsB = getParents(nodeb);

  for (let i = 0; i < parentsA.length; i += 1) {
    const currentParent = parentsA[i];
    if (parentsB.indexOf(currentParent) >= 0) {
      return currentParent;
    }
  }
  return false;
};

const findFocusable = nodes =>
  [...nodes]
    .filter(node => isVisible(node))
    .filter(node => notHiddenInput(node));


export const getTabbableNodes = topNode =>
  orderByTabIndex(
    findFocusable(getFocusables(topNode)),
  );
