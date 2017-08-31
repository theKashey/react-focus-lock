'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSideEffect = require('react-side-effect');

var _reactSideEffect2 = _interopRequireDefault(_reactSideEffect);

var _focusInside = require('./focusInside');

var _focusInside2 = _interopRequireDefault(_focusInside);

var _setFocus = require('./setFocus');

var _setFocus2 = _interopRequireDefault(_setFocus);

var _tabHook = require('./tabHook');

var _tabHook2 = _interopRequireDefault(_tabHook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FocusTrap = function FocusTrap(_ref) {
  var children = _ref.children,
      onBlur = _ref.onBlur;
  return _react2.default.createElement(
    'div',
    { onBlur: onBlur },
    children
  );
};

FocusTrap.propTypes = {
  onBlur: _react.PropTypes.func.isRequired,
  children: _react.PropTypes.node.isRequired
};

var lastActiveTrap = 0;
var activateTrap = function activateTrap() {
  if (lastActiveTrap) {
    var _lastActiveTrap = lastActiveTrap,
        observed = _lastActiveTrap.observed,
        onActivation = _lastActiveTrap.onActivation;

    if (observed && !(0, _focusInside2.default)(observed)) {
      onActivation();
      (0, _setFocus2.default)(observed);
    }
  }
};

function reducePropsToState(propsList) {
  return propsList.filter(function (_ref2) {
    var disabled = _ref2.disabled;
    return !disabled;
  }).slice(-1)[0];
}

function handleStateChangeOnClient(trap) {
  lastActiveTrap = trap;
  if (trap) {
    _tabHook2.default.attach(trap.observed, trap.sandboxed);
    activateTrap();
    setImmediate(activateTrap);
  } else {
    _tabHook2.default.detach();
  }
}

exports.default = (0, _reactSideEffect2.default)(reducePropsToState, handleStateChangeOnClient)(FocusTrap);