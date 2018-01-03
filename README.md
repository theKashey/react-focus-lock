# react-focus-lock

[![CircleCI status](https://img.shields.io/circleci/project/github/theKashey/react-focus-lock/master.svg?style=flat-square)](https://circleci.com/gh/theKashey/react-focus-lock/tree/master)

It is a trap! We got your focus and will not let him out!

[![NPM](https://nodei.co/npm/react-focus-lock.png?downloads=true&stars=true)](https://nodei.co/npm/react-focus-lock/)

This is a small, but very useful for:
 - Modal dialogs. You can not leave it with "Tab", ie tab-out.
 - Focused tasks. It will aways brings you back.
 
You have to use it in _every_ modal dialog, or you `a11y` will be shitty.
 
# How to use
Just wrap something with focus lock, and focus will be `moved inside` on mount.
```js
 import FocusLock from 'react-focus-lock';

 const JailForAFocus = ({onClose}) => (
    <FocusLock>
      You can not leave this form
      <button onClick={onClick} />
    </FocusLock>
 );
```
 Demo - https://codesandbox.io/s/72prk69z3j

# WHY?
From [MDN Article about accessible dialogs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role):
 - The dialog must be properly labeled
 - Keyboard __focus must be managed__ correctly
 
This one is about managing the focus.

I'v got a good [article about focus management, dialogs and  WAI-ARIA](https://medium.com/@antonkorzunov/its-a-focus-trap-699a04d66fb5).    

# Behavior
 0. It will always keep focus inside Lock.
 1. It will cycle forward then you press Tab.
 2. It will cycle in reverse direction on Shift+Tab.
 3. It will do it using _browser_ tools, not emulation.
 4. It will handle positive tabIndex inside form.
 5. It will prevent any jump outside, returning focus to the last element.

You can use nested Locks or have more than one Lock on the page.
Only `last`, or `deepest` one will work. No fighting.

# API
 FocusLock has few props to tune behavior
  - `disabled`, to disable(enable) behavior without altering the tree.
  - `returnFocus`, to return focus into initial position on unmount(not disable).
  This is expected behavior for Modals, but it is better to implement it by your self.
  - `allowTextSelection` enabled text selections inside, and __outside__ focus lock.
  - `noFocusGuards` disabled _focus guards_ - virtual inputs which secure tab index.
     
# Autofocus

 As long you cannot use `autoFocus` prop - 
 cos "focusing" should be delayed to Trap activation, and autoFocus will effect immediately - 
 Focus Lock provide a special API for it
      
 - prop `data-autofocus` on the element.
 - `AutoFocusInside` component, as named export of this library.
```js
 import FocusLock, { AutoFocusInside } from 'focus-lock';
 <FocusLock>
   <button>Click</button>
   <AutoFocusInside>
    <button>will be focused</button>
   </AutoFocusInside>
 </FocusLock>
 // is the same as
 <FocusLock>
   <button>Click</button>
    <button data-autofocus>will be focused</button>
 </FocusLock>

``` 

 If there is more than one auto-focusable target - the first will be selected.
 If it is a part of radio group, and __rest of radio group element are also autofocusable__(just put them into AutoFocusInside) - 
 checked one fill be selected.
 
# Unmounting and focus management
 - In case FocusLock has `returnFocus` enabled, and it's gonna to be unmounted - focus will be returned after zero-timeout.
 - In case `returnFocus` did not set, and you are going to control focus change by your own - keep in mind
 >> React will first call Parent.componentWillUnmount, and next Child.componentWillUnmount
 
 Thus means - Trap will be still active, be the time you _may_ want move(return) focus on componentWillUnmount. Please deffer this action with a zero-timeout. 
     
     

# How it works
 Everything thing is simple - react-focus-lock just dont left focus left boundaries of component, and
 do something only if escape attempt was succeeded.
 
 It is not altering tabbing behavior at all. We are good citizens.

# Not only for React
 Uses [focus-lock](https://github.com/theKashey/focus-lock/) under the hood. It does also provide support for Vue.js and Vanilla DOM solutions

# Licence
 MIT
 
 
