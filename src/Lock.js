import React, {PropTypes, Component} from 'react';
import FocusTrap from './Trap';

class FocusLock extends Component {

  state = {
    escapeAttempts: 0,
    observed: undefined,
  };

  originalFocusedElement = null;

  onTrapBlur = () =>
    // first focus leaves node, next it lands somewhere....
    setImmediate(() =>
      this.setState(prevState => ({
        escapeAttempts: prevState.escapeAttempts + 1
      }))
    );

  setObserveNode = observed =>
    this.setState({
      observed,
    });

  onActivation = () => {
    this.originalFocusedElement = this.originalFocusedElement || document.activeElement;
  }

  componentWillUnmount() {
    if (this.props.returnFocus && this.originalFocusedElement && this.originalFocusedElement.focus) {
      this.originalFocusedElement.focus();
    }
  }

  render() {
    const {children, disabled, rest} = this.props;
    const {observed, escapeAttempts} = this.state;
    return (
      <div
        ref={this.setObserveNode}
        onBlur={this.onTrapBlur}
        {...rest}
      >
        <FocusTrap
          observed={observed}
          escapeAttempts={escapeAttempts}
          disabled={disabled}
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
  returnFocus: PropTypes.bool
};

export default FocusLock;