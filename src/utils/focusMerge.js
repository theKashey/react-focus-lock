import { orderByTabIndex } from './tabOrder';
import { getCommonParent, getTabbableNodes } from './DOMutils';
import { getFocusables } from './tabUtils';

export const newFocus = (innerNodes, outerNodes, activeElement, lastNode) => {
  const cnt = innerNodes.length;
  const firstFocus = innerNodes[0];
  const lastFocus = innerNodes[cnt - 1];

  const activeIndex = outerNodes.indexOf(activeElement);
  const lastIndex = outerNodes.indexOf(lastNode || activeIndex);
  const lastNodeInside = innerNodes.indexOf(lastNode);
  const indexDiff = activeIndex - lastIndex;
  const firstNodeIndex = outerNodes.indexOf(firstFocus);
  const lastNodeIndex = outerNodes.indexOf(lastFocus);

  // new focus
  if (activeIndex === -1 || lastNodeInside === -1) {
    return 0;
  }
  // old focus
  if (!indexDiff && lastNodeInside >= 0) {
    return lastNodeInside;
  }
  // jump out
  if (indexDiff && Math.abs(indexDiff) > 1) {
    return lastNodeInside;
  }
  // focus above lock
  if (activeIndex <= firstNodeIndex) {
    return cnt - 1;
  }
  // focus below lock
  if (activeIndex > lastNodeIndex) {
    return 0;
  }
  // index is inside tab order, but outside Lock
  if (indexDiff) {
    if (Math.abs(indexDiff) > 1) {
      return lastNodeInside;
    }
    return (cnt + lastNodeInside + indexDiff) % cnt;
  }
  // do nothing
  return undefined;
};

const getFocusMerge = (topNode, lastNode) => {
  const activeElement = document.activeElement;

  const commonParent = getCommonParent(activeElement || topNode, topNode) || topNode;

  const innerNodes = getTabbableNodes(topNode);
  if (!innerNodes[0]) {
    return undefined;
  }

  const outerNodes = orderByTabIndex(getFocusables(commonParent)).map(({ node }) => node);

  const newId = newFocus(innerNodes.map(({ node }) => node), outerNodes, activeElement, lastNode);
  if (newId === undefined) {
    return newId;
  }
  return innerNodes[newId];
};

export default getFocusMerge;
