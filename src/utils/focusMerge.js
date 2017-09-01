import { orderByTabIndex } from './tabOrder';
import { getCommonParent, getTabbableNodes } from './DOMutils';
import { getFocusables } from './tabUtils';

const getFocusMerge = (topNode, lastNode) => {
  const activeElement = document.activeElement;

  const commonParent = getCommonParent(activeElement || topNode, topNode) || topNode;

  const innerNodes = getTabbableNodes(topNode);
  if (!innerNodes[0]) {
    return undefined;
  }

  const outerNodes = orderByTabIndex(getFocusables(commonParent)).map(({ node }) => node);

  const firstFocus = innerNodes[0];
  const lastFocus = innerNodes[innerNodes.length - 1];

  const activeIndex = outerNodes.indexOf(activeElement);
  const lastIndex = outerNodes.indexOf(lastNode || activeIndex);
  const lastNodeInside = innerNodes.map(({ node }) => node).indexOf(lastNode);
  const indexDiff = activeIndex - lastIndex;
  const firstNodeIndex = outerNodes.indexOf(firstFocus.node);
  const lastNodeIndex = outerNodes.indexOf(lastFocus.node);

  // new focus
  if (activeIndex === -1 || lastNodeInside === -1) {
    return firstFocus;
  }
  // old focus
  if (!indexDiff && lastNodeInside >= 0) {
    return innerNodes[lastNodeInside];
  }
  // jump out
  if (indexDiff && Math.abs(indexDiff) > 1) {
    return innerNodes[lastNodeInside];
  }
  // focus above lock
  if (activeIndex <= firstNodeIndex) {
    return lastFocus;
  }
  // focus below lock
  if (activeIndex > lastNodeIndex) {
    return firstFocus;
  }
  // index is inside tab order, but outside Lock
  if (indexDiff) {
    if (Math.abs(indexDiff) > 1) {
      return innerNodes[lastNodeInside];
    }
    return innerNodes[(innerNodes.length + lastNodeInside + indexDiff) % innerNodes.length];
  }
  // do nothing
  return undefined;
};

export default getFocusMerge;
