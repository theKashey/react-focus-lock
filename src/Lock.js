import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from './Trap';
import { deferAction } from './util';

const RenderChildren = ({ children }) => <div>{children}</div>;
RenderChildren.propTypes = {
  children: PropTypes.node.isRequired,
};
const Fragment = React.Fragment ? React.Fragment : RenderChildren;

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
    const {
      children,
      disabled,
      noFocusGuards,
      persistentFocus,
      autoFocus,
      allowTextSelection,
    } = this.props;
    const { observed } = this.state;

    if (typeof allowTextSelection !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('React-Focus-Lock: allowTextSelection is deprecated and enabled by default');
    }

    return (
      <Fragment>
        {!noFocusGuards && [
          <div key="guard-first" tabIndex={disabled ? -1 : 0} style={hidden} />, // nearest focus guard
          <div key="guard-nearest" tabIndex={disabled ? -1 : 1} style={hidden} />, // first tabbed element guard
        ]}
        <div
          ref={this.setObserveNode}
        >
          <FocusTrap
            observed={observed}
            disabled={disabled}
            persistentFocus={persistentFocus}
            autoFocus={autoFocus}
            onActivation={this.onActivation}
          >
            {children}
          </FocusTrap>
        </div>
        {!noFocusGuards && <div tabIndex={disabled ? -1 : 0} style={hidden} />}
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

};

FocusLock.defaultProps = {
  disabled: false,
  returnFocus: false,
  noFocusGuards: false,
  autoFocus: true,
  persistentFocus: false,
  allowTextSelection: undefined,
};


export default FocusLock;
