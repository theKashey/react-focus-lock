import {
  useCallback, useRef, useState, useEffect,
} from 'react';
import { createNanoEvents } from './nano-events';

const mainbus = createNanoEvents();

let subscribeCounter = 0;

const onFocusIn = event => mainbus.emit('assign', event.target);
const onFocusOut = event => mainbus.emit('reset', event.target);

/**
 * attaches focusin/focusout listener-singlenton to the document
 * it will emit "reset" event on blur/focusout and cause "set" on focus/focusin
 */
const useDocumentFocusSubscribe = () => {
  useEffect(() => {
    if (!subscribeCounter) {
      document.addEventListener('focusin', onFocusIn);
      document.addEventListener('focusout', onFocusOut);
    }
    subscribeCounter += 1;
    return () => {
      subscribeCounter -= 1;
      if (!subscribeCounter) {
        document.removeEventListener('focusin', onFocusIn);
        document.removeEventListener('focusout', onFocusOut);
      }
    };
  }, []);
};

const getFocusState = (target, current) => {
  if (target === current) {
    return 'self';
  }
  if (current.contains(target)) {
    return 'within';
  }
  return 'within-boundary';
};

export const useFocusState = () => {
  const [active, setActive] = useState(false);
  const [state, setState] = useState('');
  const ref = useRef(null);
  const focusState = useRef({});

  // initial focus
  useEffect(() => {
    if (ref.current) {
      setActive(
        ref.current === document.activeElement
          || ref.current.contains(document.activeElement),
      );
      setState(getFocusState(document.activeElement, ref.current));
    }
  }, []);

  const onFocus = useCallback((e) => {
    // element caught focus. Store, but do not set value yes
    focusState.current = {
      focused: true,
      state: getFocusState(e.target, e.currentTarget),
    };
  }, []);


  useDocumentFocusSubscribe();
  useEffect(() => {
    const fout = mainbus.on('reset', () => {
      // focus is going somewhere
      focusState.current = {};
    });
    const fin = mainbus.on('assign', () => {
      // focus event propagation is ended
      setActive(focusState.current.focused || false);
      setState(focusState.current.state || '');
    });
    return () => {
      fout();
      fin();
    };
  }, []);

  return {
    active,
    state,
    onFocus,
    ref,
  };
};
