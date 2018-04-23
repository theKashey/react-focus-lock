import React, {Component} from "react";
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
      </div>
    )
  }
}

export default () => <div><Trap1/></div>;