import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {expect} from 'chai';
import FocusLock from '../src/index';

describe('child creates a shadow tree', () => {
  beforeEach(() => {
    document.body.innerHTML ='';
  });

  it('does not stop focus from moving inside the shadow DOM', () => {
    function App() {
      return (
        <FocusLock>
          <div className="App">
            <input id="first-input"/>
            <input id="second-input"/>
          </div>
        </FocusLock>
      );
    }

    const template = document.createElement('template');
    template.innerHTML = `
          <div>
            <p part="title">React attached below</p>
            <div id="root"></div>
          </div>
        `;

    class WebComp extends HTMLElement {
      constructor() {
        super();
        // attach to the Shadow DOM
        const root = this.attachShadow({mode: 'closed'});
        root.appendChild(template.content.cloneNode(true));
        this.ref = {
          focused: () => root.activeElement,
          focusSecond: () => root.querySelector('#second-input').focus(),
        };
        ReactDOM.render(
          <App/>,
          root,
        );
      }
    }

    window.customElements.define('web-comp', WebComp);
    const webComp = document.createElement('web-comp');
    document.body.appendChild(webComp);

    webComp.focus();
    const {focused, focusSecond} = webComp.ref;
    expect(focused()).to.be.equal(null);
    // expect(document.activeElement).to.be.equal(webComp);

    focusSecond();
    expect(focused().id).to.be.equal('second-input');
  });
});