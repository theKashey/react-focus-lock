import { focusOn } from './setFocus';
import { getTabbableNodes } from './utils/focusMerge';

let target;

const handleTab = (e) => {
  if (!(e.key === 'Tab' || e.keyCode === 9) || !target.enabled) {
    return;
  }
  e.preventDefault();
  const tabbableNodes = getTabbableNodes(target.node).map(({ node }) => node);
  const cnt = tabbableNodes.length;
  const currentFocusIndex = tabbableNodes.indexOf(e.target);
  const nextNode = (cnt + currentFocusIndex + (e.shiftKey ? -1 : +1)) % cnt;

  focusOn(tabbableNodes[nextNode]);
};

const attach = () => document.addEventListener('keydown', handleTab, true);
const detach = () => document.removeEventListener('keydown', handleTab, true);

export default {
  attach(node, enabled) {
    if (enabled) {
      if (!target) {
        attach();
      }
      target = {
        node, enabled,
      };
    } else {
      this.detach();
    }
  },

  detach() {
    if (target) {
      detach();
      target = null;
    }
  },
};
