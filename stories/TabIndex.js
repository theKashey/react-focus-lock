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

class Trap extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <FocusLock disabled={this.state.disabled}>
        {disabled && <div>
          ! this is a <b>real trap</b>.<br/>
          We will steal your focus ! <br /><br />
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br />
          <br />
        </div>
        }
        <input placeholder="input1"/>

        <input placeholder="input2"/>

        <input placeholder="input3"/> <br />

        <button>A BUTTON</button>
        <br />

        <div>
          <span tabIndex={2}> tabbable-Next</span> <br />
          <span tabIndex={1}> tabbable-First</span> <br />
        </div>

        <a href='#'>link somethere</a> <br />

        { !disabled && <div>
          <br /><br />PRESS this to end the trial.<br/><br/>
          <button onClick={this.toggle}>ESCAPE!!!</button>
          <br/>
        </div>}
      </FocusLock>
    )
  }
}

const App = () =>
  <div style={styles}>
    <div style={bg}> Inaccessible <a href='#'>Link</a> outside</div>
    <Trap />
    <div style={bg}> Inaccessible <a href='#'>Link</a> outside</div>
  </div>;

export default App;