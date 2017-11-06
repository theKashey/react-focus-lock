import React, {Component} from "react";
import FocusLock, {AutoFocusInside} from "../src/index";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  fontSize: "16px"
};

const bg = {
  backgroundColor: '#FEE'
};

class Trap1 extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <div>
        using data-autofocus
        {disabled && <div>
          ! this is a <b>real trap</b>.<br/>
          We will steal your focus ! <br /><br />
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br />
          <br />
        </div>
        }
        <FocusLock disabled={this.state.disabled}>
          <button >BUTTON</button>
          <button data-autofocus>Will be autofocused</button>
          <button >BUTTON</button>
          <br />

          <a href='#'>link somethere</a> <br />

          {
            !disabled && <div>
              <button onClick={this.toggle}>DEACTIVATE</button>
              <br/>
            </div>
          }
        </FocusLock>
      </div>
    )
  }
}

class Trap2 extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <div>
        Using AutoFocusInside
        {disabled && <div>
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br />
          <br />
        </div>
        }
        <FocusLock disabled={this.state.disabled}>
          <button >BUTTON</button>
          <AutoFocusInside>
            <button>Will be autofocused</button>
          </AutoFocusInside>
          <button >BUTTON</button>
          <br />

          <a href='#'>link somethere</a> <br />

          {
            !disabled && <div>
              <button onClick={this.toggle}>DEACTIVATE</button>
              <br/>
            </div>
          }
        </FocusLock>
      </div>
    )
  }
}

export default () => <div><Trap1/><br/><br/><Trap2/></div>;