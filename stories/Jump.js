import React, {Component} from "react";
import FocusLock from "../src/index";

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
  };

  toggle = () => {
    setTimeout(() => {
      this.setState({disabled: !this.state.disabled});
    }, 10);
  };

  render() {
    const {disabled} = this.state;
    return (
      <div>
        <button>Button</button>
        <div style={{marginTop: '70vh'}}>
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
        </div>

        {!disabled && <FocusLock returnFocus noFocusGuards>
          <button>BUTTON</button>
          <a href='#'>link somethere</a> <br/>
          <button onClick={this.toggle}>DEACTIVATE</button>
        </FocusLock>
        }
        <div style={{marginTop: '70vh'}}>
          <button>Button</button>
        </div>
      </div>
    )
  }
}

export default () => <div><Trap1/></div>;