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
    }, 1000);
  };

  render() {
    const {disabled} = this.state;
    return (
      <div>
        Place focus here
        <div>
          <button>Button</button>
          <input name="i1" value='or here'></input>
          <a href='#'>link somethere</a> <br/>
          <br/>
          <br/>
        </div>
        <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>

        {!disabled && <FocusLock returnFocus>
          <button>BUTTON</button>
          <a href='#'>link somethere</a> <br/>
          <button onClick={this.toggle}>DEACTIVATE</button>
        </FocusLock>
        }
      </div>
    )
  }
}

export default () => <div><Trap1/></div>;