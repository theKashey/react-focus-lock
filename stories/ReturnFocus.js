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

let counter =0;

class Trap1 extends Component {
  state = {
    disabled: !this.props.active,
    sub: false,
    x: counter++,
  };

  toggle = () => {
    setTimeout(() => {
      this.setState({disabled: !this.state.disabled});
    }, 10);
  };

  openNew = () => {
    this.setState({sub: true});
  }

  render() {
    const {disabled, sub, x} = this.state;
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
          <button onClick={this.openNew}>Open another modal {x}</button>
          {sub && <Trap1 active/>}
        </FocusLock>
        }
      </div>
    )
  }
}

export default () => <div><Trap1/></div>;