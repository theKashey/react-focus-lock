import * as React from 'react';
import FocusLock from '../src/index';

export class Video extends React.Component {
    state = {
      disabled: true,
    }

    toggle = () => this.setState({ disabled: !this.state.disabled });

    render() {
      const { disabled } = this.state;
      return (
        <div>
          <button onClick={this.toggle}>!ACTIVATE THE TRAP!</button>
          <FocusLock
            disabled={disabled}
            _whiteList={(node) => {
              console.log(node);
              return false;
            }}
          >
            <button onClick={this.toggle}>deactivate</button>
            <video controls width="250">
              <source
                src="https://interactive-examples.mdn.mozilla.net/media/examples/flower.webm"
                type="video/webm"
              />
              <source
                src="https://interactive-examples.mdn.mozilla.net/media/examples/flower.mp4"
                type="video/mp4"
              />
              Sorry, your browser doesn't support embedded videos.
            </video>
            <button onClick={this.toggle}>deactivate</button>
          </FocusLock>
        </div>
      );
    }
}

export const FormOverride = () => (
  <FocusLock>
    <form>
      <input name="contains" type="text" />
      <input name="id" type="text" />
      <input name="focus" type="text" />
    </form>
  </FocusLock>
);


const ModalWithoutAutoFocus = () => (
  <div>
    <dialog open style={{ border: '1px solid black' }}>
      <FocusLock autoFocus={false}>
        <div>
          <h4>Title</h4>
          <div>
            <button>Button A</button>
          </div>
          <div>
            <button>Button B</button>
          </div>
          <div>
            <button>Button C</button>
          </div>
        </div>
      </FocusLock>
    </dialog>
  </div>
);
export const NonAutofocusModal = () => {
  const [isOpen, togglerIsOpen] = React.useState(false);

  return (
    <div className="App">
      <div>
        <div>
          <button onClick={() => togglerIsOpen(true)}>Open modal</button>
        </div>
        <div>
          <button>Other Button</button>
        </div>
        <div>
          <button>Other Button</button>
        </div>
        <div>
          <button>Other Button</button>
        </div>
        <div>
          <button>Other Button</button>
        </div>
      </div>
      <div>{isOpen && <ModalWithoutAutoFocus />}</div>
      <button>Other Button</button>
    </div>
  );
};
