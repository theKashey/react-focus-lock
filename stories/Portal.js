import * as React from "react";
import { Component } from "react";
import {createPortal} from 'react-dom';
import FocusLock from "../src/index";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  fontSize: "16px"
};

const bg = {
  backgroundColor: '#FEE'
};

const makeElement = () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
};

class Trap1 extends Component {
  state = {
    disabled: true
  };

  toggle = () => {
    setTimeout(() => {
      this.setState({disabled: !this.state.disabled});
    }, 10);
  };

  focus = () => {
    document.getElementById('portaled2').focus();
  };

  render() {
    const {disabled} = this.state;
    return (
      <div>
        <button>Button</button>
        <div style={{marginTop: '7vh'}}>
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
        </div>

        {!disabled && <FocusLock returnFocus noFocusGuards persistentFocus={true}>
          <button>BUTTON</button>
          <a href='#'>link somethere</a> <br/>
          <button onClick={this.toggle}>DEACTIVATE</button>
          <button onClick={this.focus}>focus</button>
          <div>{createPortal(
            <div>
              <button id="portaled2">i am portaled</button>
              <button id="portaled3" autoFocus>and i am portaled</button>
            </div>,
            makeElement()
          )}</div>
        </FocusLock>
        }
        <div style={{marginTop: '7vh'}}>
          <button>Button</button>
        </div>

        <div id="target1"></div>
        <div id="target2"></div>
      </div>
    )
  }
}

class ShardTrap1 extends Component {
  state = {
    disabled: true
  };

  ref1 = React.createRef();
  ref2 = React.createRef();

  toggle = () => {
    this.setState({disabled: !this.state.disabled});
    // setTimeout(() => {
    //   this.setState({});
    // }, 10);
  };

  focus = () => {
    console.log(this.ref1, this.ref2);
    window.ref2 = this.ref2;
    document.getElementById('portaled2').focus();
  };

  render() {
    const {disabled} = this.state;
    return (
      <div>
        <button>Button</button>
        <div style={{marginTop: '7vh'}}>
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
        </div>

        <div id="target1"></div>
        <div id="target2"></div>


        {!disabled && <>
          <FocusLock returnFocus noFocusGuards persistentFocus={true} shards={[this.ref2]} autoFocus>
            <button>BUTTON</button>
            <a href='#'>link somethere</a> <br/>
            <button onClick={this.toggle}>DEACTIVATE</button>
            <button onClick={this.focus} data-autofocus>focus</button>

            <div>{createPortal(
              <div ref={this.ref1} style={{border: '1px solid #000'}}>
                <button>button</button>
                <button id="portaled2">inner portal</button>
                <button>button</button>
              </div>,
              document.getElementById('target1')
            )}</div>
          </FocusLock>

          <div>{createPortal(
            <div id="portalTarget" ref={this.ref2} style={{border: '1px solid #000'}}>
              <button>button</button>
              <button id="portaled3">outer portal</button>
              <button>button</button>
            </div>,
            document.getElementById('target2')
          )}</div>

        </>
        }

        <div style={{marginTop: '7vh'}}>
          <button>Button</button>
        </div>

      </div>
    )
  }
}

export const PortalCase = () => <div><Trap1/></div>;

export const ShardPortalCase = () => <div><ShardTrap1/></div>;