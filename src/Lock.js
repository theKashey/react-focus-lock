import * as React from 'react';
import {
  node, bool, string, any, arrayOf, oneOfType, object, func,
} from 'prop-types';
import * as constants from 'focus-lock/constants';
import { useMergeRefs } from 'use-callback-ref';

import { hiddenGuard } from './FocusGuard';
import {
  mediumFocus, mediumBlur, mediumSidecar,
} from './medium';
import { focusScope } from './scope';

const emptyArray = [];

const FocusLock = React.forwardRef(function FocusLockUI(props, parentRef) {
  const [realObserved, setObserved] = React.useState();
  const observed = React.useRef();
  const isActive = React.useRef(false);
  const originalFocusedElement = React.useRef(null);

  const [, update] = React.useState({});

  const {
    children,
    disabled = false,
    noFocusGuards = false,
    persistentFocus = false,
    crossFrame = true,
    autoFocus = true,
    allowTextSelection,
    group,
    className,
    whiteList,
    hasPositiveIndices,
    shards = emptyArray,
    as: Container = 'div',
    lockProps: containerProps = {},
    sideCar: SideCar,

    returnFocus: shouldReturnFocus = false,
    focusOptions,

    onActivation: onActivationCallback,
    onDeactivation: onDeactivationCallback,
  } = props;

  const [id] = React.useState({});

  // SIDE EFFECT CALLBACKS

  const onActivation = React.useCallback(({ captureFocusRestore }) => {
    if (!originalFocusedElement.current) {
      const activeElement = document?.activeElement;
      originalFocusedElement.current = activeElement;
      // store stack reference
      if (activeElement !== document.body) {
        originalFocusedElement.current = captureFocusRestore(activeElement);
      }
    }

    if (observed.current && onActivationCallback) {
      onActivationCallback(observed.current);
    }
    isActive.current = true;
    update();
  }, [onActivationCallback]);

  const onDeactivation = React.useCallback(() => {
    isActive.current = false;
    if (onDeactivationCallback) {
      onDeactivationCallback(observed.current);
    }
    update();
  }, [onDeactivationCallback]);

  const returnFocus = React.useCallback((allowDefer) => {
    const { current: focusRestore } = originalFocusedElement;
    if (focusRestore) {
      const returnFocusTo = (typeof focusRestore === 'function' ? focusRestore() : focusRestore) || document.body;
      const howToReturnFocus = typeof shouldReturnFocus === 'function' ? shouldReturnFocus(returnFocusTo) : shouldReturnFocus;
      if (howToReturnFocus) {
        const returnFocusOptions = typeof howToReturnFocus === 'object' ? howToReturnFocus : undefined;
        originalFocusedElement.current = null;

        if (allowDefer) {
          // React might return focus after update
          // it's safer to defer the action
          Promise.resolve().then(() => returnFocusTo.focus(returnFocusOptions));
        } else {
          returnFocusTo.focus(returnFocusOptions);
        }
      }
    }
  }, [shouldReturnFocus]);

  // MEDIUM CALLBACKS

  const onFocus = React.useCallback((event) => {
    if (isActive.current) {
      mediumFocus.useMedium(event);
    }
  }, []);

  const onBlur = mediumBlur.useMedium;

  // REF PROPAGATION
  // not using real refs due to race conditions

  const setObserveNode = React.useCallback((newObserved) => {
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
      // report incorrect integration - https://github.com/theKashey/react-focus-lock/issues/123
      if (!observed.current && typeof Container !== 'string') {
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

  const mergedRef = useMergeRefs([parentRef, setObserveNode]);

  const focusScopeValue = React.useMemo(() => ({
    observed,
    shards,
    enabled: !disabled,
    active: isActive.current,
  }), [disabled, isActive.current, shards, realObserved]);

  return (
    <React.Fragment>
      {hasLeadingGuards && [
        // nearest focus guard
        <div key="guard-first" data-focus-guard tabIndex={disabled ? -1 : 0} style={hiddenGuard} />,

        // first tabbed element guard
        hasPositiveIndices
          ? <div key="guard-nearest" data-focus-guard tabIndex={disabled ? -1 : 1} style={hiddenGuard} />
          : null,
      ]}
      {!disabled && (
        <SideCar
          id={id}
          sideCar={mediumSidecar}
          observed={realObserved}
          disabled={disabled}
          persistentFocus={persistentFocus}
          crossFrame={crossFrame}
          autoFocus={autoFocus}
          whiteList={whiteList}
          shards={shards}
          onActivation={onActivation}
          onDeactivation={onDeactivation}
          returnFocus={returnFocus}
          focusOptions={focusOptions}
        />
      )}
      <Container
        ref={mergedRef}
        {...lockProps}
        className={className}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        <focusScope.Provider value={focusScopeValue}>
          {children}
        </focusScope.Provider>
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
  returnFocus: oneOfType([bool, object, func]),
  focusOptions: object,
  noFocusGuards: bool,
  hasPositiveIndices: bool,

  allowTextSelection: bool,
  autoFocus: bool,
  persistentFocus: bool,
  crossFrame: bool,

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

export default FocusLock;
