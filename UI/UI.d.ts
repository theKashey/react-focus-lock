import * as React from 'react';
import {ReactFocusLockProps, AutoFocusProps, FreeFocusProps, InFocusGuardProps} from "../interfaces";

/**
 * Traps Focus inside a Lock
 */
export default class ReactFocusLock extends React.Component<ReactFocusLockProps & {
  sideCar: React.SFC<any>
}> {
}

/**
 * Autofocus on children on Lock activation
 */
export class AutoFocusInside extends React.Component<AutoFocusProps> {
}

/**
 * Autofocus on children
 */
export class MoveFocusInside extends React.Component<AutoFocusProps> {
}

/**
 * Allow free focus inside on children
 */
export class FreeFocusInside extends React.Component<FreeFocusProps> {
}

/**
 * Secures the focus around the node
 */
export class InFocusGuard extends React.Component<InFocusGuardProps> {
}