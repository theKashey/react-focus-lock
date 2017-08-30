'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tabbables = require('./tabbables');

var _tabbables2 = _interopRequireDefault(_tabbables);

var _tabOrder = require('./tabOrder');

var _tabOrder2 = _interopRequireDefault(_tabOrder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var findFocusable = function findFocusable(nodes) {
  return [].concat(_toConsumableArray(nodes)).filter(function (node) {
    return window.getComputedStyle(node, null).getPropertyValue('display') !== 'none';
  });
};

var orderByTabIndex = function orderByTabIndex(nodes) {
  return nodes.map(function (node, index) {
    return {
      node: node,
      index: index,
      tabIndex: +node.getAttribute('tabIndex') || node.tabIndex
    };
  }).filter(function (data) {
    return data.tabIndex >= 0;
  }).sort(_tabOrder2.default);
};

exports.default = function (topNode) {
  var focusable = orderByTabIndex(findFocusable(topNode.querySelectorAll(_tabbables2.default.join(','))))[0];

  if (focusable) {
    var target = focusable.node;
    target.focus();
    if (target.contentWindow) {
      target.contentWindow.focus();
    }
  }
};