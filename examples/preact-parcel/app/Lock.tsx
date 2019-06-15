import { h } from 'preact';
import * as React from "react";
import FocusLockUI from "react-focus-lock/UI";
import {sidecar} from "use-sidecar";

const styles = {
  fontFamily: "sans-serif",
  fontSize: "16px"
};

const bg = {
  backgroundColor: '#FEE'
};

const FocusLockSidecar = sidecar(() => import("react-focus-lock/sidecar"));

class Trap extends React.Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <FocusLockUI
        disabled={this.state.disabled}
        sideCar={FocusLockSidecar}
      >
        {disabled && <div>
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br/>
          <br/>
        </div>
        }
        You will cycle over this. Never leaving <br/>
        <input placeholder="input1"/>

        <input placeholder="input2"/>

        <input placeholder="input3"/> <br/>

        <button>A BUTTON</button>
        <br/>

        <a href='#'>link somethere</a> <br/>

        {!disabled && <div>
          <br/><br/>PRESS this to end the trial.<br/><br/>
          <button onClick={this.toggle}>ESCAPE!!!</button>
          <br/>
        </div>}
      </FocusLockUI>
    )
  }
}

const Lock = () =>
  <div style={styles}>
    <input placeholder="input1"/>
    <div style={bg}> Inaccessible <a href='#'>Link</a> outside</div>
    <Trap/>
    <div style={bg}> Inaccessible <a href='#'>Link</a> outside</div>
    <input placeholder="input1"/>
  </div>;

export default Lock;