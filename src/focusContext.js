// Resolve focus without relying on constructors from the outer window's realm.
export const getActiveElement = (root) => {
  const active = root && root.activeElement;
  if (!active) {
    return null;
  }
  if (active.shadowRoot) {
    return getActiveElement(active.shadowRoot) || active;
  }
  if (active.tagName === 'IFRAME') {
    try {
      return getActiveElement(active.contentDocument) || active;
    } catch (e) {
      // Cross-origin frames are opaque.
    }
  }
  return active;
};

export const getOwnerDocument = node => (node ? node.ownerDocument : document);
