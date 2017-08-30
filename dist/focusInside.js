'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var focusInsideIframe = function focusInsideIframe(topNode) {
  return !![].concat(_toConsumableArray(topNode.querySelectorAll('iframe'))).find(function (frame) {
    return frame.contentWindow.document.hasFocus();
  });
};

exports.default = function (topNode) {
  return topNode.querySelector('*:focus') || focusInsideIframe(topNode);
};