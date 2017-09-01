const focusInsideIframe = topNode =>
  !![...topNode.querySelectorAll('iframe')].find(frame => frame.contentWindow.document.hasFocus());

export default topNode =>
  topNode.querySelector('*:focus') || focusInsideIframe(topNode);
