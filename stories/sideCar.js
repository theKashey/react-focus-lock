import React, {Component, useState, useReducer, useEffect} from "react";
import {FocusLockUI} from "../src/index";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  fontSize: "16px"
};

const bg = {
  backgroundColor: '#FEE'
};

const sideCar = importer => (props) => {
  const [Car, setCar] = useReducer((_, s) => s, null);
  const [error, setError] = useReducer((_, s) => s, null);

  useEffect(() => {
    importer()
      .then(
        car => setCar(car.default),
        e => setError(e),
      )
  }, []);

  useEffect(() => {
    if (error) {
      // on Error(error);
    }
  }, [error]);

  return Car ? <Car {...props} /> : null;
}

const FocusLockSidecar = sideCar(() => import("../src/sidecar"));

class Trap extends Component {
  state = {
    disabled: true
  }

  toggle = () => this.setState({disabled: !this.state.disabled});

  render() {
    const {disabled} = this.state;
    return (
      <FocusLockUI
        disabled={this.state.disabled}
        sideCar={FocusLockSidecar}
      >
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
      </FocusLockUI>
    )
  }
}

const App = () =>
  <div style={styles}>
    <input placeholder="input1"/>
    <div style={bg}> Inaccessible <a href='#'>Link</a> outside</div>
    <Trap/>
    <div style={bg}> Inaccessible <a href='#'>Link</a> outside</div>
    <input placeholder="input1"/>
  </div>;

export default App;