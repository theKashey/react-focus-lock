import * as React from "react";
import { Component } from "react";
import FocusLock from "../src/index";

export class DisabledForm extends React.Component {
  state = {
    string: "",
    disabled: false
  };

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    return (
      <div>
        <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
        <FocusLock disabled={this.state.disabled}>
          <input
            onChange={({target}) => this.setState({string: target.value})}
            type="text"
            tabIndex="0"
          />
          <button>a</button>
          <button disabled={this.state.string.length == 0} tabIndex="0">
            Save
          </button>
          <button>b</button>
        {!this.state.disabled && <button onClick={this.toggle}>DEACTIVATE</button>}
      </FocusLock>
      </div>
    );
  }
}

export class DisabledFormWithTabIndex extends React.Component {
  state = {
    string: "",
    disabled: false
  };

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    return (
      <div>
        <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
        <FocusLock disabled={this.state.disabled}>
          <input
            onChange={({target}) => this.setState({string: target.value})}
            type="text"
            tabIndex="1"
          />
          <button>a</button>
          <button disabled={this.state.string.length == 0} tabIndex="1">
            Save
          </button>
          <button>b</button>
          {/*{!this.state.disabled && <button onClick={this.toggle} tabIndex={2}>DEACTIVATE</button>}*/}
        </FocusLock>
      </div>
    );
  }
}