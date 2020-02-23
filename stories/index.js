import * as React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';


import DefaultAll from './Default';
import Iframe from './Iframe';
import SideCar from './sideCar';
import TabIndex from './TabIndex';
import AutoFocus from './Autofocus';
import ReturnFocus from './ReturnFocus';
import {Trap1, Trap2, Trap3, Trap4} from './Checkboxes';
import {TextSelectionEnabled, TextSelectionDisabled, TextSelectionTabIndexEnabled} from './TextSelection';
import JumpCase, {NoTailingGuard} from './Jump';
import {GroupCase, ShardGroupCase} from './Group';
import {PortalCase, ShardPortalCase} from './Portal';
import {MUISelect, MUISelectWhite} from './MUI';
import Fight from './FocusFighting';
import {StyledComponent, StyledSection} from "./Custom";
import {AutoDisabledForm, DisabledForm, DisabledFormWithTabIndex} from "./Disabled";
import {Video} from "./Exotic";
import {TabbableParent} from "./TabbableParent";

const frameStyle = {
  width: '400px',
  padding: '10px',
  margin: '100px auto',
};

const Frame = ({children}) => (<div style={frameStyle}>{children}</div>);

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
  .add('disabled', () => <Frame><TextSelectionDisabled/></Frame>)
  .add('tabindex -1', () => <Frame><TextSelectionTabIndexEnabled/></Frame>);

storiesOf('Jump', module)
  .add('jump', () => <Frame><JumpCase/></Frame>)
  .add('no tailing guard', () => <Frame><NoTailingGuard/></Frame>)

storiesOf('Portal', module)
  .add('portal', () => <Frame><PortalCase/></Frame>)
  .add('shard portal', () => <Frame><ShardPortalCase/></Frame>);

storiesOf('Group', module)
  .add('focus group', () => <Frame><GroupCase/></Frame>)
  .add('shard group', () => <Frame><ShardGroupCase/></Frame>);

storiesOf('Material UI', module)
  .add('Select', () => <Frame><MUISelect/></Frame>)
  .add('Select White', () => <Frame><MUISelectWhite/></Frame>)

storiesOf('Focus fighting', module)
  .add('fight', () => <Frame><Fight/></Frame>);

storiesOf('Custom component', module)
  .add('as styled section', () => <Frame><StyledSection/></Frame>)
  .add('as custom component', () => <Frame><StyledComponent/></Frame>);

storiesOf('Disabled', module)
  .add('disabled element', () => <Frame><DisabledForm/></Frame>)
  .add('disabled element with tabindex', () => <Frame><DisabledFormWithTabIndex/></Frame>)

storiesOf('Excotic', module)
  .add('video', () => <Frame><Video/></Frame>)
  .add('iframe', () => <Frame><Iframe/></Frame>)
  .add('sidecar', () => <Frame><SideCar/></Frame>)
  .add('tabbable parent', () => <Frame><TabbableParent/></Frame>);