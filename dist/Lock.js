'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Trap = require('./Trap');

var _Trap2 = _interopRequireDefault(_Trap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FocusLock = function (_Component) {
  _inherits(FocusLock, _Component);

  function FocusLock() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FocusLock);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FocusLock.__proto__ || Object.getPrototypeOf(FocusLock)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      escapeAttempts: 0,
      observed: undefined
    }, _this.originalFocusedElement = null, _this.onTrapBlur = function () {
      return (
        // first focus leaves node, next it lands somewhere....
        setImmediate(function () {
          return _this.setState(function (prevState) {
            return {
              escapeAttempts: prevState.escapeAttempts + 1
            };
          });
        })
      );
    }, _this.setObserveNode = function (observed) {
      return _this.setState({
        observed: observed
      });
    }, _this.onActivation = function () {
      _this.originalFocusedElement = _this.originalFocusedElement || document.activeElement;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FocusLock, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.returnFocus && this.originalFocusedElement && this.originalFocusedElement.focus) {
        this.originalFocusedElement.focus();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          disabled = _props.disabled,
          rest = _props.rest;
      var _state = this.state,
          observed = _state.observed,
          escapeAttempts = _state.escapeAttempts;

      return _react2.default.createElement(
        'div',
        _extends({
          ref: this.setObserveNode,
          onBlur: this.onTrapBlur
        }, rest),
        _react2.default.createElement(
          _Trap2.default,
          {
            observed: observed,
            escapeAttempts: escapeAttempts,
            disabled: disabled,
            onBlur: this.onTrapBlur,
            onActivation: this.onActivation
          },
          children
        )
      );
    }
  }]);

  return FocusLock;
}(_react.Component);

FocusLock.propTypes = {
  children: _react.PropTypes.node.isRequired,
  disabled: _react.PropTypes.bool,
  returnFocus: _react.PropTypes.bool
};

exports.default = FocusLock;