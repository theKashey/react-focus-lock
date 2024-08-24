import * as React from 'react';
import { Component } from 'react';
import FocusLock from '../src/index';

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
  fontSize: '16px',
};

const bg = {
  backgroundColor: '#FEE',
};

class Trap extends Component {
  state = {
    disabled: true,
  }

  toggle = () => this.setState({ disabled: !this.state.disabled });

  render() {
    const { disabled } = this.state;
    return (
      <FocusLock disabled={this.state.disabled} crossFrame={false}>
        {disabled && (
        <div>
          ! this is a
          {' '}
          <b>real trap</b>
          .
          <br />
          We will steal your focus !
          {' '}
          <br />
          <br />
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br />
          <br />
        </div>
        )
        }
        You will cycle over this. Never leaving
        {' '}
        <br />
        <input placeholder="input1" />
        {this.props.children}
        <input placeholder="input2" />

        { !disabled && (
        <div>
          <br />
          <br />
          PRESS this to end the trial.
          <br />
          <br />
          <button onClick={this.toggle}>ESCAPE!!!</button>
          <br />
          All your focus belongs to us!
        </div>
        )}
      </FocusLock>
    );
  }
}

export const IFrame = props => (
  <div style={styles}>
    <input placeholder="input1" />
    <div style={bg}>
      {' '}
      Inaccessible
      <a href="#">Link</a>
      {' '}
      outside
    </div>
    <Trap {...props}>
      <iframe src={`/iframe.html?id=focus-lock--codesandbox-example&crossFrame=${props.crossFrame}`} style={{ width: '100%', height: '400px' }} />
    </Trap>
    <div style={bg}>
      {' '}
      Inaccessible
      <a href="#">Link</a>
      {' '}
      outside
    </div>
    <input placeholder="input1" />
  </div>
);

export const SandboxedIFrame = props => (
  <div style={styles}>
    <input placeholder="input1" />
    <div style={bg}>
      {' '}
      Inaccessible
      <a href="#">Link</a>
      {' '}
      outside
    </div>
    <Trap {...props}>
      <iframe
        title="test-iframe"
        src="https://chekrd.github.io/custom-element/index.html"
        sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts allow-downloads allow-storage-access-by-user-activation"
      />
    </Trap>
    <div style={bg}>
      {' '}
      Inaccessible
      <a href="#">Link</a>
      {' '}
      outside
    </div>
    <input placeholder="input1" />
  </div>
);
