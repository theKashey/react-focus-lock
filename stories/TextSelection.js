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

      <FocusLock disabled={this.state.disabled} persistentFocus={!this.props.allowTextSelection}>

        <button onClick={this.toggle}>
          {disabled ? "!ACTIVATE THE TRAP!" : "DISABLE"}
        </button>

        <br/>
        <br/>
        Some text
        {this.props.children}
        <input placeholder="input2"/>
        <input placeholder="input3"/> <br/>
        { Array(100).fill(1).map(x => <div>{x}---</div>)}
        Some text
        <button>A BUTTON</button>
      </FocusLock>
    )
  }
}

const TextSelectionEnabled = () =>
  <div style={styles}>
    <input placeholder="input1"/>
    Some text
    <div style={bg}>
      <Trap allowTextSelection/>
    </div>
    Some text
    <input placeholder="input1"/>
  </div>;

const TextSelectionDisabled = () =>
  <div style={styles}>
    <input placeholder="input1"/>
    Some text
    <div style={bg}>
      <Trap/>
    </div>
    Some text
    <input placeholder="input1"/>
  </div>;

const TextSelectionTabIndexEnabled = () =>
  <div style={styles}>
    <input placeholder="input1"/>
    Some text
    <div style={bg}>
      <Trap allowTextSelection>
        <div tabIndex={-1}>
          test
          <input />
          set
        </div>
      </Trap>
    </div>
    Some text
    <input placeholder="input1"/>
  </div>;

export {
  TextSelectionEnabled,
  TextSelectionDisabled,
  TextSelectionTabIndexEnabled,
}