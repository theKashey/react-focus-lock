import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'focus-lock/constants';
import { hiddenGuard } from './FocusGuard';
import { mediumFocus, mediumBlur, mediumSidecar } from './medium';

const RenderChildren = ({ children }) => <div>{children}</div>;
RenderChildren.propTypes = {
  children: PropTypes.node.isRequired,
};

const Fragment = React.Fragment ? React.Fragment : RenderChildren;

const emptyArray = [];

class FocusLock extends Component {
  state = {
    observed: undefined,
  };

  onActivation = () => {
    this.originalFocusedElement = (
      this.originalFocusedElement || (document && document.activeElement)
    );
    if (this.state.observed && this.props.onActivation) {
      this.props.onActivation(this.state.observed);
    }
    this.isActive = true;
  };

  onDeactivation = () => {
    this.isActive = false;
    if (this.props.onDeactivation) {
      this.props.onDeactivation(this.state.observed);
    }
  };

  onFocus = (event) => {
    if (this.isActive) {
      mediumFocus.useMedium(event);
    }
  };

  onBlur = mediumBlur.useMedium;

  setObserveNode = (observed) => {
    if (this.state.observed !== observed) {
      this.setState({
        observed,
      });
    }
  };

  returnFocus = () => {
    if (
      this.props.returnFocus &&
      this.originalFocusedElement &&
      this.originalFocusedElement.focus
    ) {
      this.originalFocusedElement.focus();
      this.originalFocusedElement = null;
    }
  };

  // active status is tracked outside React state
  isActive = false;

  originalFocusedElement = null;

  render() {
    const {
      children,
      disabled,
      noFocusGuards,
      persistentFocus,
      autoFocus,
      allowTextSelection,
      group,
      className,
      whiteList,
      shards = emptyArray,
      as: Container = 'div',
      lockProps: containerProps = {},
      sideCar: SideCar,
    } = this.props;
    const { observed } = this.state;

    if (process.env.NODE_ENV !== 'production') {
      if (typeof allowTextSelection !== 'undefined') {
        // eslint-disable-next-line no-console
        console.warn('React-Focus-Lock: allowTextSelection is deprecated and enabled by default');
      }
    }

    const lockProps = {
      [constants.FOCUS_DISABLED]: disabled && 'disabled',
      [constants.FOCUS_GROUP]: group,
      ...containerProps,
    };

    const hasLeadingGuards = noFocusGuards !== true;
    const hasTailingGuards = hasLeadingGuards && (noFocusGuards !== 'tail');

    return (
      <Fragment>
        {hasLeadingGuards && [
          <div key="guard-first" data-focus-guard tabIndex={disabled ? -1 : 0} style={hiddenGuard} />, // nearest focus guard
          <div key="guard-nearest" data-focus-guard tabIndex={disabled ? -1 : 1} style={hiddenGuard} />, // first tabbed element guard
        ]}
        <Container
          ref={this.setObserveNode}
          {...lockProps}
          className={className}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        >
          {!disabled && (
            <SideCar
              sideCar={mediumSidecar}
              observed={observed}
              disabled={disabled}
              persistentFocus={persistentFocus}
              autoFocus={autoFocus}
              whiteList={whiteList}
              shards={shards}
              onActivation={this.onActivation}
              onDeactivation={this.onDeactivation}
              returnFocus={this.returnFocus}
            />
          )}
          {children}
        </Container>
        {
          hasTailingGuards &&
          <div data-focus-guard tabIndex={disabled ? -1 : 0} style={hiddenGuard} />
        }
      </Fragment>
    );
  }
}

FocusLock.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  returnFocus: PropTypes.bool,
  noFocusGuards: PropTypes.bool,

  allowTextSelection: PropTypes.bool,
  autoFocus: PropTypes.bool,
  persistentFocus: PropTypes.bool,

  group: PropTypes.string,
  className: PropTypes.string,

  whiteList: PropTypes.func,
  shards: PropTypes.arrayOf(PropTypes.any),

  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
  lockProps: PropTypes.object,

  onActivation: PropTypes.func,
  onDeactivation: PropTypes.func,

  sideCar: PropTypes.any.isRequired,
};

FocusLock.defaultProps = {
  disabled: false,
  returnFocus: false,
  noFocusGuards: false,
  autoFocus: true,
  persistentFocus: false,
  allowTextSelection: undefined,
  group: undefined,
  className: undefined,
  whiteList: undefined,
  shards: undefined,
  as: 'div',
  lockProps: {},

  onActivation: undefined,
  onDeactivation: undefined,
};


export default FocusLock;
