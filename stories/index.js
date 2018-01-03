import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';


import DefaultAll from './Default';
import TabIndex from './TabIndex';
import AutoFocus from './Autofocus';
import ReturnFocus from './ReturnFocus';
import {Trap1, Trap2, Trap3, Trap4} from './Checkboxes';
import {TextSelectionEnabled, TextSelectionDisabled} from './TextSelection';
import JumpCase from './Jump';

const frameStyle = {
  width: '400px',
  padding: '10px',
  margin: '100px auto',
};

const Frame = ({children}) => <div style={frameStyle}>{children}</div>

storiesOf('Focus lock', module)
  .add('codesanbox example', () => <Frame><DefaultAll/></Frame>)
  .add('TabIndex example', () => <Frame><TabIndex/></Frame>)
  .add('autofocus', () => <Frame><AutoFocus/></Frame>)
  .add('return focus', () => <Frame><ReturnFocus/></Frame>);

storiesOf('Checkboxes', module)
  .add('autofocus', () => <Frame><Trap1/></Frame>)
  .add('no focus', () => <Frame><Trap2/></Frame>)
  .add('forcefocus', () => <Frame><Trap3/></Frame>)
  .add('fake', () => <Frame><Trap4/></Frame>);

storiesOf('Text selection', module)
  .add('enabled', () => <Frame><TextSelectionEnabled/></Frame>)
  .add('disabled', () => <Frame><TextSelectionDisabled/></Frame>);

storiesOf('Jump', module)
  .add('jump', () => <Frame><JumpCase /></Frame>);


