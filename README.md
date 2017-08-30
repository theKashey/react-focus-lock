# react-focus-lock
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


You can use nested Locks or have more than one Lock on the page.
Only `last`, or `deepest` one will work. No fighting.

# API
 FocusLock has only 2 props:
  - `disabled`, to disable(enable) behavior without altering the tree.
  - `returnFocus`, to return focus into initial position on unmount(not disable).
  I strongly recommend you NOT to use this feature. But sometimes it might be usable.

# How it works
 Everything thing is simple - react-focus-lock just dont left focus left boundaries of component, and
 do something only if escape attempt was succeeded.
 
 It is not altering tabbing behavior at all. We are good citizens.

# Licence
 MIT
 
 
