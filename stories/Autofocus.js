import React, {Component} from "react";
import FocusLock, {AutoFocusInside} from "../src/index";
import MoveFocusInside from "../src/MoveFocusInside";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  fontSize: "16px"
};

const box = {
  border: '1px solid #000',
  margin: '10px',
  padding: '10px',
  fontSize: '14px',
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
          We will steal your focus ! <br/><br/>
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br/>
          <br/>
        </div>
        }
        <FocusLock disabled={this.state.disabled}>
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
          <br/>
          <br/>
        </div>
        }
        <FocusLock disabled={this.state.disabled}>

          <button>BUTTON</button>
          <AutoFocusInside>
            <button>Will be autofocused</button>
          </AutoFocusInside>
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


class Trap3 extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <div>
        Using autofocus: false
        {disabled && <div>
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <br/>
          <br/>
        </div>
        }
        <FocusLock autoFocus={false} disabled={this.state.disabled}>
          Nothing to be focused...
          <button>BUTTON</button>
          <button>BUTTON</button>
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

class Trap4 extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <div>
        using MoveFocusInside
        {disabled && <div>
          <button onClick={this.toggle}>!SET FOCUS!</button>
          <br/>
          <br/>
        </div>
        }
        <MoveFocusInside disabled={disabled}>

          <button>BUTTON</button>
          <MoveFocusInside  disabled={disabled}>
            <button>to be focused</button>
          </MoveFocusInside>
          <button>BUTTON</button>
          <br/>

          <a href='#'>link somethere</a> <br/>

          {
            !disabled && <div>
              <button onClick={this.toggle}>DEACTIVATE</button>
              <br/>
            </div>
          }
        </MoveFocusInside>
      </div>
    )
  }
}

class Trap5 extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <div>
        using MoveFocusInside with Lock
        {disabled && <div>
          <button onClick={this.toggle}>!SET FOCUS!</button>
          <br/>
          <br/>
        </div>
        }
        <FocusLock autoFocus={false} disabled={disabled}>
          <MoveFocusInside disabled={disabled}>

            <button>BUTTON</button>
            <MoveFocusInside  disabled={disabled}>
              <button>to be focused</button>
            </MoveFocusInside>
            <button>BUTTON</button>
            <br/>

            <a href='#'>link somethere</a> <br/>

            {
              !disabled && <div>
                <button onClick={this.toggle}>DEACTIVATE</button>
                <br/>
              </div>
            }
          </MoveFocusInside>
        </FocusLock>
      </div>
    )
  }
}


export default () => <div>
  <div style={box}><Trap1/></div>
  <div style={box}><Trap2/></div>
  <div style={box}><Trap3/></div>

  <div style={box}><Trap4/></div>
  <div style={box}><Trap5/></div>
</div>;