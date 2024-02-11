import {
  useCallback, useRef, useState, useEffect,
} from 'react';
import { createNanoEvents } from './nano-events';

const mainbus = createNanoEvents();

export const useFocusState = () => {
  const [marker] = useState({});
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  const onFocus = useCallback(() => {
    mainbus.emit('focus', marker);
  }, []);

  useEffect(() => {
    setActive(
      ref.current === document.activeElement
        || ref.current.contains(document.activeElement),
    );
  }, []);

  useEffect(() => mainbus.on('focus', (event) => {
    setActive(event === marker);
  }), []);

  return {
    active,
    onFocus,
    ref,
  };
};
