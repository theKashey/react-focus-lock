'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setFocus = require('./setFocus');

var target = void 0;

var handleTab = function handleTab(e) {
  if (!(e.key === 'Tab' || e.keyCode === 9) || !target.enabled) {
    return;
  }
  e.preventDefault();
  var tabbableNodes = (0, _setFocus.getTabbableNodes)(target.node).map(function (_ref) {
    var node = _ref.node;
    return node;
  });
  var cnt = tabbableNodes.length;
  var currentFocusIndex = tabbableNodes.indexOf(e.target);
  var nextNode = (cnt + currentFocusIndex + (e.shiftKey ? -1 : +1)) % cnt;

  (0, _setFocus.focusOn)(tabbableNodes[nextNode]);
};

var _attach = function _attach() {
  return document.addEventListener('keydown', handleTab, true);
};
var _detach = function _detach() {
  return document.removeEventListener('keydown', handleTab, true);
};

exports.default = {
  attach: function attach(node, enabled) {
    if (enabled) {
      if (!target) {
        _attach();
      }
      target = {
        node: node, enabled: enabled
      };
    } else {
      this.detach();
    }
  },
  detach: function detach() {
    if (target) {
      _detach();
      target = null;
    }
  }
};