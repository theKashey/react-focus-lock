import React, {Component} from "react";
import FocusLock from "../src/index";

export class StyledSection extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <div>
        should be a styled section
        {disabled && <div>
          ! this is a <b>real trap</b>.<br/>
          We will steal your focus ! <br/><br/>
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br/>
          <br/>
        </div>
        }
        <FocusLock disabled={this.state.disabled} as="section" lockProps={{style:{border:"1px solid red"}}}>
          <button>BUTTON</button>
          <button data-autofocus>Will be autofocused</button>
          <button>BUTTON</button>
          <br/>

          <a href='#'>link somethere</a> <br/>

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

const Comp = (props) => <main {...props} data-focus-locked-test/>;

export class StyledComponent extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <div>
        should be a styled section
        {disabled && <div>
          ! this is a <b>real trap</b>.<br/>
          We will steal your focus ! <br/><br/>
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br/>
          <br/>
        </div>
        }
        <FocusLock disabled={this.state.disabled} as={Comp} lockProps={{style: {border: "1px solid red"}}}>
          <button>BUTTON</button>
          <button data-autofocus>Will be autofocused</button>
          <button>BUTTON</button>
          <br/>

          <a href='#'>link somethere</a> <br/>

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
