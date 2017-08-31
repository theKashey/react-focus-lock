import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {expect} from 'chai';
import {mount} from 'enzyme';
import FocusLock from '../src/Lock';
import FocusTrap from '../src/Trap';

/*

 render true
 deactivate d-action2
 render false
 ✓ Should return focus (58ms)


 render true
 deactivate d-action2
 render false
 1) Should return focus

 */

describe('react-focus-lock', () => {

  describe('FocusTrap', () => {

  });

  describe('FocusLock', () => {
    let mountPoint;

    beforeEach(() => {
      mountPoint = document.createElement('div');
      document.body.appendChild(mountPoint);
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(mountPoint);
      document.body.removeChild(mountPoint);
      document.body.innerHTML = '';
      document.body.focus();
    });

    if (1)
      it('Should not focus on inputs', () => {
        const wrapper = mount(<div>
          <div>
            text
            <button className="action1">action1</button>
            text
          </div>
          <div>
            text
            <button className="action2">1-action2</button>
            text
          </div>
        </div>, mountPoint);
        wrapper.find('.action1').getDOMNode().focus();
        expect(document.activeElement.innerHTML).to.be.equal('action1');
        wrapper.find('.action2').getDOMNode().focus();
        expect(document.activeElement.innerHTML).to.be.equal('1-action2');
      });

    it('Should return focus', (done) => {
      class Test extends Component {
        state = {
          focused: true
        };

        deactivate = () => {
          this.setState({
            focused: false
          });
        };

        render() {
          return (
            <div className='clickTarget' onClick={this.deactivate}>
              {
                this.state.focused && <FocusLock returnFocus>
                  <div>
                    text
                    <button className="action2">d-action2</button>
                    text
                  </div>
                </FocusLock>
              }
            </div>
          )
        }
      }
      const wrapper = mount(
        <div>
          <div>
            text
            <button className="action1">d-action1</button>
            text
            <button className="action1" autoFocus>d-action3</button>
          </div>
          <Test/>
        </div>, mountPoint);
      expect(document.activeElement.innerHTML).to.be.equal('d-action2');
      wrapper.find('.clickTarget').simulate('click');
      setTimeout(() => {
        expect(document.activeElement.innerHTML).to.be.equal('d-action3');
        done();
      }, 1);
    });
    /**/

    if (1)
      it('Should focus on inputs', (done) => {
        const wrapper = mount(<div>
          <div>
            text
            <button className="action1">action1</button>
            text
          </div>
          <FocusLock>
            <div>
              text
              <button className="action2-false" disabled>action2-false</button>
              <button className="action2">2-action2</button>
              text
            </div>
          </FocusLock>
        </div>, mountPoint);
        wrapper.find('.action1').getDOMNode().focus();
        expect(document.activeElement.innerHTML).to.be.equal('action1');
        setTimeout(() => {
          expect(document.activeElement.innerHTML).to.be.equal('2-action2');
          done();
        }, 10);
      });

    if (1)
      it('Should be enabled only on last node', (done) => {
        const wrapper = mount(<div>
          <div>
            text
            <button className="action1">action1</button>
            text
          </div>
          <FocusLock>
            <div>
              text
              <button className="action2">3-action2</button>
              text
            </div>
          </FocusLock>
          <FocusLock>
            <div>
              text
              <button className="action3">action3</button>
              text
            </div>
          </FocusLock>
        </div>, mountPoint);
        wrapper.find('.action1').getDOMNode().focus();
        expect(document.activeElement.innerHTML).to.be.equal('action1');
        setTimeout(() => {
          expect(document.activeElement.innerHTML).to.be.equal('action3');
          done();
        }, 1);
      });
    /**/

    if (1)
      it('Should handle disabled state', (done) => {
        const wrapper = mount(<div>
          <div>
            text
            <button className="action1">action1</button>
            text
          </div>
          <FocusLock>
            <div>
              text
              <button className="action2">4-action2</button>
              text
            </div>
          </FocusLock>
          <FocusLock disabled>
            <div>
              text
              <button className="action3">action3</button>
              text
            </div>
          </FocusLock>
        </div>, mountPoint);
        wrapper.find('.action1').getDOMNode().focus();
        expect(document.activeElement.innerHTML).to.be.equal('action1');
        setTimeout(() => {
          expect(document.activeElement.innerHTML).to.be.equal('4-action2');
          done();
        }, 1);
      });
    /**/

  });


});