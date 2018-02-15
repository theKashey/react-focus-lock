/* eslint-disable import/first */

import 'babel-polyfill';

import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { userAgent: 'node.js' });

const { window } = jsdom;

global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.HTMLElement = window.HTMLElement;

function copyProps(src, target) {
  const properties = Object
    .getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));

  Object.defineProperties(target, properties);
}

copyProps(window, global);

import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());
