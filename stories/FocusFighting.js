import React, {Component} from "react";
import FocusLock, {} from "../src/index";
import FreeFocusInside from "../src/FreeFocusInside";

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
      <FocusLock disabled={this.state.disabled} className="class1">
        {disabled && <div>
          ! this is a <b>real trap</b>.<br/>
          We will steal your focus ! <br/><br/>
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
          All your focus belongs to us!
        </div>}

      </FocusLock>
    )
  }
}

class Fight extends React.Component {
  state = {
    disabled: true
  }

  render() {
    return (
      <div>
        <button onClick={() => this.setState({disabled: !this.state.disabled})}>toggle war</button>
        : {this.state.disabled ? 'disabled' : 'enabled'}
        <input
          ref={ref => this.ref = ref}
          defaultValue="battlefield"
          onBlur={this.state.disabled ? undefined : () => this.ref.focus()}
        />
      </div>
    );
  }
}

const App = () =>
  <div style={styles}>
    <input placeholder="input1"/>
    <div style={bg}> Inaccessible <a href='#'>Link</a> outside</div>
    <Trap/>
    <div style={bg}> Inaccessible <a href='#'>Link</a> outside</div>
    <div style={bg}>
      <FreeFocusInside className="class2">
        Accessible outside
        <input placeholder="input1"/>
      </FreeFocusInside>
    </div>
    <Fight/>
    <input placeholder="input1"/>
  </div>;

export default App;