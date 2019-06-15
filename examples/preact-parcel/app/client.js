import { h } from 'preact';
import React from 'react';
import ReactDOM from 'react-dom';
import Lock from "./Lock";

const element = document.getElementById('app');
const app = (<Lock/>);


ReactDOM.render(app, element);
