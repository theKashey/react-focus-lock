"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (a, b) {
  var tabDiff = a.tabIndex - b.tabIndex;
  var indexDiff = a.index - b.index;
  if (tabDiff) {
    if (a.tabIndex) {
      return tabDiff;
    } else {
      return -tabDiff;
    }
  }
  return indexDiff;
};