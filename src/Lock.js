import React, { useState, useRef, useCallback } from 'react';
import {
  node, bool, string, any, arrayOf, oneOfType, object, func,
} from 'prop-types';
import * as constants from 'focus-lock/constants';
import { useMergeRefs } from 'use-callback-ref';

import { hiddenGuard } from './FocusGuard';
import { mediumFocus, mediumBlur, mediumSidecar } from './medium';

const emptyArray = [];

const FocusLock = React.forwardRef((props, parentRef) => {
  const [realObserved, setObserved] = useState();
  const observed = useRef();
  const isActive = useRef(false);
  const originalFocusedElement = useRef(null);

  const {
    children,
    disabled,
    noFocusGuards,
    persistentFocus,
    autoFocus,
    allowTextSelection,
    group,
    className,
    whiteList,
    shards = emptyArray,
    as: Container = 'div',
    lockProps: containerProps = {},
    sideCar: SideCar,

    returnFocus: shouldReturnFocus,

    onActivation: onActivationCallback,
    onDeactivation: onDeactivationCallback,
  } = props;

  const [id] = useState({});

  // SIDE EFFECT CALLBACKS

  const onActivation = useCallback(() => {
    originalFocusedElement.current = (
      originalFocusedElement.current || (document && document.activeElement)
    );
    if (observed.current && onActivationCallback) {
      onActivationCallback(observed.current);
    }
    isActive.current = true;
  }, [onActivationCallback]);

  const onDeactivation = useCallback(() => {
    isActive.current = false;
    if (onDeactivationCallback) {
      onDeactivationCallback(observed.current);
    }
  }, [onDeactivationCallback]);

  const returnFocus = useCallback((allowDefer) => {
    const { current } = originalFocusedElement;
    if (Boolean(shouldReturnFocus) && current && current.focus) {
      const focusOptions = typeof shouldReturnFocus === 'object' ? shouldReturnFocus : undefined;
      originalFocusedElement.current = null;

      if (allowDefer) {
        // React might return focus after update
        // it's safer to defer the action
        Promise.resolve().then(() => current.focus(focusOptions));
      } else {
        current.focus(focusOptions);
      }
    }
  }, [shouldReturnFocus]);

  // MEDIUM CALLBACKS

  const onFocus = useCallback((event) => {
    if (isActive.current) {
      mediumFocus.useMedium(event);
    }
  }, []);

  const onBlur = mediumBlur.useMedium;

  // REF PROPAGATION
  // not using real refs due to race conditions

  const setObserveNode = useCallback((newObserved) => {
    if (observed.current !== newObserved) {
      observed.current = newObserved;
      setObserved(newObserved);
    }
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    if (typeof allowTextSelection !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('React-Focus-Lock: allowTextSelection is deprecated and enabled by default');
    }

    React.useEffect(() => {
      if (!observed.current) {
        // eslint-disable-next-line no-console
        console.error('FocusLock: could not obtain ref to internal node');
      }
    }, []);
  }

  const lockProps = {
    [constants.FOCUS_DISABLED]: disabled && 'disabled',
    [constants.FOCUS_GROUP]: group,
    ...containerProps,
  };

  const hasLeadingGuards = noFocusGuards !== true;
  const hasTailingGuards = hasLeadingGuards && (noFocusGuards !== 'tail');

  const mergedRef = useMergeRefs([parentRef, setObserveNode])

  return (
    <React.Fragment>
      {hasLeadingGuards && [
        <div key="guard-first" data-focus-guard tabIndex={disabled ? -1 : 0} style={hiddenGuard} />, // nearest focus guard
        <div key="guard-nearest" data-focus-guard tabIndex={disabled ? -1 : 1} style={hiddenGuard} />, // first tabbed element guard
      ]}
      {!disabled && (
        <SideCar
          id={id}
          sideCar={mediumSidecar}
          observed={realObserved}
          disabled={disabled}
          persistentFocus={persistentFocus}
          autoFocus={autoFocus}
          whiteList={whiteList}
          shards={shards}
          onActivation={onActivation}
          onDeactivation={onDeactivation}
          returnFocus={returnFocus}
        />
      )}
      <Container
        ref={mergedRef}
        {...lockProps}
        className={className}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {children}
      </Container>
      {
        hasTailingGuards
        && <div data-focus-guard tabIndex={disabled ? -1 : 0} style={hiddenGuard} />
      }
    </React.Fragment>
  );
});

FocusLock.propTypes = {
  children: node,
  disabled: bool,
  returnFocus: oneOfType([bool, object]),
  noFocusGuards: bool,

  allowTextSelection: bool,
  autoFocus: bool,
  persistentFocus: bool,

  group: string,
  className: string,

  whiteList: func,
  shards: arrayOf(any),

  as: oneOfType([string, func, object]),
  lockProps: object,

  onActivation: func,
  onDeactivation: func,

  sideCar: any.isRequired,
};

FocusLock.defaultProps = {
  children: undefined,
  disabled: false,
  returnFocus: false,
  noFocusGuards: false,
  autoFocus: true,
  persistentFocus: false,
  allowTextSelection: undefined,
  group: undefined,
  className: undefined,
  whiteList: undefined,
  shards: undefined,
  as: 'div',
  lockProps: {},

  onActivation: undefined,
  onDeactivation: undefined,
};

export default FocusLock;
