import * as React from "react";
import { Component } from "react";
import FocusLock, {InFocusGuard} from "../src/index";

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

        {!disabled && <FocusLock returnFocus group="g1">
          <button>BUTTON</button>
          <a href='#'>link somethere</a> <br/>
          <button onClick={this.toggle}>DEACTIVATE</button>
        </FocusLock>
        }
        some text outsite
        <div style={{marginTop: '70vh'}}>
          <button>Button</button>
        </div>
        some text outsite
        {!disabled && <FocusLock returnFocus group="g1">
          <button>BUTTON</button>
          <a href='#'>link somethere</a> <br/>
          <button onClick={this.toggle}>DEACTIVATE</button>
        </FocusLock>
        }
      </div>
    )
  }
}

export class ShardGroupCase extends React.Component {
  ref1 = React.createRef();
  ref2 = React.createRef();
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

        <InFocusGuard>
          <button>Button1</button>
        </InFocusGuard>
        <InFocusGuard>
          <button ref={this.ref1}>Button2</button>
        </InFocusGuard>
        <InFocusGuard>
          <button>Button3</button>
        </InFocusGuard>

        {!disabled && <FocusLock returnFocus shards={[this.ref1.current, this.ref2.current]}>
          <button>BUTTON</button>
          <a href='#'>link somethere</a> <br/>
          <button onClick={this.toggle}>DEACTIVATE</button>
        </FocusLock>
        }
        some text outsite
        <div style={{marginTop: '70vh'}}>
          <button>Button</button>
        </div>
        some text outsite
        <div ref={this.ref2}>
          <button>BUTTON</button>
          <a href='#'>link somethere</a> <br/>
          <button onClick={this.toggle}>DEACTIVATE</button>
        </div>
        <button>button outside</button>
      </div>
    )
  }
}

export const GroupCase = () => <div><Trap1/></div>;