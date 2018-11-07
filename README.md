<div align="left">
  <h1 align="center">REACT FOCUS LOCK</h1>
  <img src="./assets/ackbar.png" alt="it-is-a-trap" width="200" height="200" align="right">
  
  The way to manage your focus.<br/>
  The way to lock it inside.<br/>
  The way to team up with a11y.<br/> <br/>
  Make you site a better place. For everyone.<br/>

[![CircleCI status](https://img.shields.io/circleci/project/github/theKashey/react-focus-lock/master.svg?style=flat-square)](https://circleci.com/gh/theKashey/react-focus-lock/tree/master)
[![npm](https://img.shields.io/npm/v/react-focus-lock.svg)](https://www.npmjs.com/package/react-focus-lock)

  <hr/>  
</div>


It is a trap! We got your focus and will not let him out!

[![NPM](https://nodei.co/npm/react-focus-lock.png?downloads=true&stars=true)](https://nodei.co/npm/react-focus-lock/)

This is a small library, but very useful for:
 - Modal dialogs. You can not leave it with "Tab", ie do a "tab-out".
 - Focused tasks. It will aways brings you back, as you can "lock" user inside a component.
 
You have to lock _every_ modal dialog, that's what `a11y` is asking for.

And this is most comprehensive focus lock/trap ever built. 

# Features
 - no keyboard control, everything is done watching a __focus behavior__, not emulating tabs. Thus works always and everywhere.
 - React __Portals__ support. Even if some data is in outerspace - it is [still in lock](https://github.com/theKashey/react-focus-lock/issues/19).
 - _Scattered_ locks, or focus lock groups - you can setup different isolated locks, and _tab_ from one to another.
 - Controllable isolation level. 
 
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
Demo - https://codesandbox.io/s/5wmrwlvxv4.

### Final piece for a modals

That is actually not enough, - you shall not lock the focus, but also disable page scroll and user iteractions with the rest of a page - "shadow" rest of the page, to make it unclickable or
unscrollable. 
And [react-locky](https://github.com/theKashey/react-locky) is your next component to check.

# WHY?
From [MDN Article about accessible dialogs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role):
 - The dialog must be properly labeled
 - Keyboard __focus must be managed__ correctly
 
This one is about managing the focus.

I'v got a good [article about focus management, dialogs and  WAI-ARIA](https://medium.com/@antonkorzunov/its-a-focus-trap-699a04d66fb5).    

# API
 FocusLock has few props to tune behavior
  - `disabled`, to disable(enable) behavior without altering the tree.
  - `returnFocus`, to return focus into initial position on unmount(not disable).
  This is expected behavior for Modals, but it is better to implement it by your self.
  - `persistentFocus`, default false, requires any element to be focused. This also disables text selections inside, and __outside__ focus lock.
  - `autoFocus`, default true, enables or disables focusing into on Lock activation. If disabled Lock will blur an active focus.
  - `noFocusGuards` disabled _focus guards_ - virtual inputs which secure tab index.
  - `group` named focus group for focus scattering aka [combined lock targets](https://github.com/theKashey/vue-focus-lock/issues/2)
  - `whiteList` you could _whitelist_ locations FocusLock should carry about. Everything outside it will ignore. For example - any modals.
  - `as` if you need to change internal `div` element, to any other. Use ref forwarding to give FocusLock the node to work with.
  - `lockProps` to pass any extra props (except className) to the internal wrapper.

# Behavior
 0. It will always keep focus inside Lock.
 1. It will cycle forward then you press Tab.
 2. It will cycle in reverse direction on Shift+Tab.
 3. It will do it using _browser_ tools, not emulation.
 4. It will handle positive tabIndex inside form.
 5. It will prevent any jump outside, returning focus to the last element.

### Focusing in OSX (Safary/FireFox) is strange!
By default `tabbing` in OSX `sees` only control, but not links or anything else `tabbable`. This is system settings, and Safary/FireFox obey.
Press Option+Tab in Safary to loop across all tabbables, or change the Safary settings. There is no way to _fix_ FireFox, unless change system settings (Control+F7). See [this issue](https://github.com/theKashey/react-focus-lock/issues/24) for more information.

You can use nested Locks or have more than one Lock on the page.
Only `last`, or `deepest` one will work. No fighting.
     
# Autofocus

 As long you cannot use `autoFocus` prop - 
 cos "focusing" should be delayed to Trap activation, and autoFocus will effect immediately - 
 Focus Lock provide a special API for it
      
 - prop `data-autofocus` on the element.
 - prop `data-autofocus-inside` on the element to focus on something inside.
 - `AutoFocusInside` component, as named export of this library.
```js
 import FocusLock, { AutoFocusInside } from 'react-focus-lock';
 
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
 
 <FocusLock as="section">
    <button>Click</button>
    <button data-autofocus>will be focused</button>
 </FocusLock>
 
 <FocusLock as={AnotherComponent} lockProps={{anyProp: 4}}>
    <button>Click</button>
    <button data-autofocus>will be focused</button>
 </FocusLock>
``` 

 If there is more than one auto-focusable target - the first will be selected.
 If it is a part of radio group, and __rest of radio group element are also autofocusable__(just put them into AutoFocusInside) - 
 checked one fill be selected.
 
 `AutoFocusInside` will work only on Lock activation, and does nothing, then used outside of the lock.
 You can use `MoveFocusInside` to move focus inside with or without lock.
 
```js
 import { MoveFocusInside } from 'react-focus-lock';
    
 <MoveFocusInside>
  <button>will be focused</button>
 </MoveFocusInside>
 ```
 
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
 
# More
Dont forget to lock the scroll to complete the picture.
 [react-scroll-locky](https://github.com/theKashey/react-scroll-locky) - browser scrollbars hiding, you were looking for.

# Warning!
Two different _focus-lock-managers_ or even different version of a single one, active
simultaneously will FIGHT!

__Focus-lock will surrender__, as long any other focus management library will not.

## Focus fighting
You may wrap some render branch with `FreeFocusInside`, and react-focus-lock __will ignore__
any focus inside marked node, thus landing a peace.

```js
import { FreeFocusInside } from 'react-focus-lock';

<FreeFocusInside>
 <div id="portal-for-modals">
   in this div i am going to portal my modals, dont fight with them please
 </div>
</FreeFocusInside>
```

Even the better is to `whiteList` FocusLock areas - for example "you should handle only React Stuff in React Root"
```js
<FocusLock whiteList={node => document.getElementById('root').contains(node)}>
 ...
</FocusLock>
```

PS: __please use webpack or yarn resolution for force one version of react-focus-lock used__

> webpack.conf
```js
 resolve: {    
    alias: {
      'react-focus-lock': path.resolve(path.join(__dirname, './node_modules/react-focus-lock'))
 ...
```

# Package size
About __6kb__ _with all dependencies, minified and gzipped_.

# Licence
 MIT
 
 
