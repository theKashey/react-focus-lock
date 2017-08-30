import 'babel-polyfill';

import 'jsdom';
/* eslint-disable import/imports-first */
import { JSDOM } from 'jsdom';
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {userAgent: 'node.js'});

const { window } = jsdom;

global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.HTMLElement = window.HTMLElement;

function copyProps(src, target) {
  Object.defineProperties(target,
    Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop))
  );
}

copyProps(window, global);

import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
//import dirtyChai from 'dirty-chai';


//chai.use(dirtyChai);
chai.use(chaiEnzyme());
//chai.use(sinonChai);