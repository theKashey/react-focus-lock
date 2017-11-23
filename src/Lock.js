import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from './Trap';

const hidden = {
  width: '1px',
  height: '0px',
  padding: 0,
  overflow: 'hidden',
};

class FocusLock extends Component {
  state = {
    observed: undefined,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.disabled && !this.props.disabled) {
      this.originalFocusedElement = null;
    }
  }

  componentWillUnmount() {
    if (
      this.props.returnFocus &&
      this.originalFocusedElement &&
      this.originalFocusedElement.focus
    ) {
      this.originalFocusedElement.focus();
    }
  }

  onActivation = () => {
    this.originalFocusedElement = this.originalFocusedElement || document.activeElement;
  };

  setObserveNode = observed =>
    this.setState({
      observed,
    });

  update = () =>
    this.setState(prevState => ({
      escapeAttempts: prevState.escapeAttempts + 1,
    }));

  originalFocusedElement = null;

  render() {
    const { children, disabled, noFocusGuards } = this.props;
    const { observed } = this.state;
    return (
      <div>
        {!noFocusGuards && [
          <div tabIndex={disabled ? -1 : 0} style={hidden} />, // nearest focus guard
          <div tabIndex={disabled ? -1 : 1} style={hidden} />, // first tabbed element guard
        ]}
        <div
          ref={this.setObserveNode}
          onBlur={this.onTrapBlur}
        >
          <FocusTrap
            observed={observed}
            disabled={disabled}
            onActivation={this.onActivation}
          >
            {children}
          </FocusTrap>
        </div>
        {!noFocusGuards && <div tabIndex={disabled ? -1 : 0} style={hidden} />}
      </div>
    );
  }
}

FocusLock.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  returnFocus: PropTypes.bool,
  noFocusGuards: PropTypes.bool,
};

FocusLock.defaultProps = {
  disabled: false,
  returnFocus: false,
  sandboxed: false,
  noFocusGuards: false,
};


export default FocusLock;
