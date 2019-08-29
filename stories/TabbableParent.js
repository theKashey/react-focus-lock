import React from "react";
import FocusLock from "../src/index";

export class TabbableParent extends React.Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <div>
        <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
        <div tabIndex={-1}>
          HOHO!

          <FocusLock disabled={disabled} _whiteList={node => {
            console.log(node);
            return false;
          }}>
            <button onClick={this.toggle}>deactivate</button>

            <a href="#">link1</a>
            <br/> <br/>
            <button>A</button>{' '}
            <button>B</button>{' '}
            <button>C</button>
            <br/> <br/>
            <a href="#">link2</a>

            <button onClick={this.toggle}>deactivate</button>
          </FocusLock>
        </div>
      </div>
    );
  }
}