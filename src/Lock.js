import React, { useState, useRef, useCallback } from 'react';
import {
  node, bool, string, any, arrayOf, oneOfType, object, func,
} from 'prop-types';
import * as constants from 'focus-lock/constants';
import { hiddenGuard } from './FocusGuard';
import { mediumFocus, mediumBlur, mediumSidecar } from './medium';

const emptyArray = [];

function FocusLock(props) {
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

  const returnFocus = useCallback(() => {
    const { current } = originalFocusedElement;
    if (Boolean(shouldReturnFocus) && current && current.focus) {
      const focusOptions = typeof shouldReturnFocus === 'object' ? shouldReturnFocus : undefined;
      current.focus(focusOptions);
      originalFocusedElement.current = null;
    }
  }, []);

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
  }

  const lockProps = {
    [constants.FOCUS_DISABLED]: disabled && 'disabled',
    [constants.FOCUS_GROUP]: group,
    ...containerProps,
  };

  const hasLeadingGuards = noFocusGuards !== true;
  const hasTailingGuards = hasLeadingGuards && (noFocusGuards !== 'tail');

  return (
    <React.Fragment>
      {hasLeadingGuards && [
        <div key="guard-first" data-focus-guard tabIndex={disabled ? -1 : 0} style={hiddenGuard} />, // nearest focus guard
        <div key="guard-nearest" data-focus-guard tabIndex={disabled ? -1 : 1} style={hiddenGuard} />, // first tabbed element guard
      ]}
      <Container
        ref={setObserveNode}
        {...lockProps}
        className={className}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {!disabled && (
          <SideCar
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
        {children}
      </Container>
      {
        hasTailingGuards
        && <div data-focus-guard tabIndex={disabled ? -1 : 0} style={hiddenGuard} />
      }
    </React.Fragment>
  );
}

FocusLock.propTypes = {
  children: node.isRequired,
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
