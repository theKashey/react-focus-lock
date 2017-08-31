import React, { PropTypes, Component } from 'react';
import FocusTrap from './Trap';

class FocusLock extends Component {
  state = {
    escapeAttempts: 0,
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

  onTrapBlur = () =>
    // first focus leaves node, next it lands somewhere....
    setImmediate(() =>
      this.setState(prevState => ({
        escapeAttempts: prevState.escapeAttempts + 1,
      })),
    );

  onActivation = () => {
    this.originalFocusedElement = this.originalFocusedElement || document.activeElement;
  }

  setObserveNode = observed =>
    this.setState({
      observed,
    });

  originalFocusedElement = null;

  render() {
    const { children, disabled, sandboxed } = this.props;
    const { observed, escapeAttempts } = this.state;
    return (
      <div
        ref={this.setObserveNode}
        onBlur={this.onTrapBlur}
      >
        <FocusTrap
          observed={observed}
          escapeAttempts={escapeAttempts}
          disabled={disabled}
          sandboxed={sandboxed}
          onBlur={this.onTrapBlur}
          onActivation={this.onActivation}
        >
          {children}
        </FocusTrap>
      </div>
    );
  }
}

FocusLock.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  returnFocus: PropTypes.bool,
  sandboxed: PropTypes.bool,
};

FocusLock.defaultProps = {
  disabled: false,
  returnFocus: false,
  sandboxed: false,
};


export default FocusLock;
