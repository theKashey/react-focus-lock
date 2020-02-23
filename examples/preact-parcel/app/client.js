import { h } from 'preact';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Lock from "./Lock";

const element = document.getElementById('app');
const app = (<Lock/>);


ReactDOM.render(app, element);
