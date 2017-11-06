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
        {disabled && <div>
          ! this is a <b>real trap</b>.<br/>
          We will steal your focus ! <br /><br />
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br />
          <br />
        </div>
        }
        <FocusLock disabled={this.state.disabled}>
          Focus on checked element
          <input type="radio" name="test" value="1" />
          <input type="radio" name="test" value="2" checked/>
          <input type="radio" name="test" value="3" />
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
        {disabled && <div>
          ! this is a <b>real trap</b>.<br/>
          We will steal your focus ! <br /><br />
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br />
          <br />
        </div>
        }
        <FocusLock disabled={this.state.disabled}>
          <button>Will be focused</button>
          <input type="radio" name="test" value="1" />
          <input type="radio" name="test" value="2" checked/>
          <input type="radio" name="test" value="3" />
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

class Trap3 extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <div>
        {disabled && <div>
          ! this is a <b>real trap</b>.<br/>
          We will steal your focus ! <br /><br />
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br />
          <br />
        </div>
        }
        <FocusLock disabled={this.state.disabled}>
          <button>Fill be focused</button>
          Focus on checked autofocus element
          <AutoFocusInside>
          <input type="radio" name="test" value="1"  />
          <input type="radio" name="test" value="2"  checked/>
          <input type="radio" name="test" value="3"  />
          </AutoFocusInside>
          <br />

          <button>button</button> <br />

          {
            !disabled && <div>
              <button onClick={this.toggle}>DEACTIVATE</button>
              <br/>
            </div>
          }
        </FocusLock>
        <button>External button</button> <br />
      </div>
    )
  }
}

class Trap4 extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <div>
        {disabled && <div>
          ! this is a <b>real trap</b>.<br/>
          We will steal your focus ! <br /><br />
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br />
          <br />
        </div>
        }
        must be ignored ->
        <input type="radio" name="test" value="1" data-autofocus checked/>
        <FocusLock disabled={this.state.disabled}>
          <button>A Button</button>
          <input type="radio" name="test" value="3" checked/>
          <AutoFocusInside>
          <input type="radio" name="test" value="1" />
          <input type="radio" name="test" value="2" />
          <input type="radio" name="test" value="3" checked/>
          </AutoFocusInside>
          <br />

          {
            !disabled && <div>
              <button onClick={this.toggle}>DEACTIVATE</button>
              <br/>
            </div>
          }
        </FocusLock>
        <button>External button</button> <br />
      </div>
    )
  }
}

export {
  Trap1,
  Trap2,
  Trap3,
  Trap4
};