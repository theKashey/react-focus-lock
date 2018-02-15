import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from './Trap';
import { deferAction } from './util';

const hidden = {
  width: '1px',
  height: '0px',
  padding: 0,
  overflow: 'hidden',
  position: 'fixed',
  top: 0,
  left: 0,
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
      deferAction(() => this.originalFocusedElement.focus(), 0);
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
    const { children, disabled, noFocusGuards, allowTextSelection } = this.props;
    const { observed } = this.state;
    return (
      <React.Fragment>
        {!noFocusGuards && [
          <div key="guard-first" tabIndex={disabled ? -1 : 0} style={hidden} />, // nearest focus guard
          <div key="guard-nearest" tabIndex={disabled ? -1 : 1} style={hidden} />, // first tabbed element guard
        ]}
        <div
          ref={this.setObserveNode}
          onBlur={this.onTrapBlur}
        >
          <FocusTrap
            observed={observed}
            disabled={disabled}
            allowTextSelection={allowTextSelection}
            onActivation={this.onActivation}
          >
            {children}
          </FocusTrap>
        </div>
        {!noFocusGuards && <div tabIndex={disabled ? -1 : 0} style={hidden} />}
      </React.Fragment>
    );
  }
}

FocusLock.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  returnFocus: PropTypes.bool,
  noFocusGuards: PropTypes.bool,
  allowTextSelection: PropTypes.bool,
};

FocusLock.defaultProps = {
  disabled: false,
  returnFocus: false,
  sandboxed: false,
  noFocusGuards: false,
  allowTextSelection: false,
};


export default FocusLock;
