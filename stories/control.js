import React, { useEffect, useState } from 'react';
import FocusLock, { useFocusScope } from '../src/index';
import { useFocusState } from '../src/use-focus-state';

const ControlTrap = () => {
  const { autofocus, focusNext, focusPrev } = useFocusScope();

  useEffect(() => {
    autofocus();
  }, []);

  const onKey = (event) => {
    if (event.key === 'ArrowDown') {
      focusNext();
    }
    if (event.key === 'ArrowUp') {
      focusPrev();
    }
  };

  return (
    <div onKeyDown={onKey} style={{ border: '1px solid black' }}>
      <button>Button1</button>
      <button>Button2</button>
      <button>Button3</button>
      <button>Button4</button>
    </div>
  );
};


const FocusButton = ({ children }) => {
  const { active, onFocus, ref } = useFocusState();
  return <button tabIndex={active ? undefined : -1} onFocus={onFocus} ref={ref}>{children}</button>;
};
const RowingFocusTrap = () => {
  const { autofocus, focusNext, focusPrev } = useFocusScope();

  useEffect(() => {
    autofocus();
  }, []);

  const onKey = (event) => {
    if (event.key === 'ArrowDown') {
      focusNext({ onlyTabbable: false });
    }
    if (event.key === 'ArrowUp') {
      focusPrev({ onlyTabbable: false });
    }
  };

  const { active, onFocus, ref } = useFocusState();

  return (
    <div
      onKeyDown={onKey}
      onFocus={onFocus}
      ref={ref}
      style={{ border: active ? '3px solid green' : '3px solid grey' }}
    >
      <button>zero</button>
      <FocusButton>Button1</FocusButton>
      <FocusButton>Button2</FocusButton>
      <FocusButton>Button3</FocusButton>
      <FocusButton>Button4</FocusButton>
    </div>
  );
};

const ControlledFocusButton = ({ children, onFocus: reportFocused, isActive }) => {
  const { active, onFocus, ref } = useFocusState();
  useEffect(() => {
    if (active) {
      reportFocused();
    }
  }, [active]);

  return <button tabIndex={isActive ? undefined : -1} onFocus={onFocus} ref={ref}>{children}</button>;
};
const ConstantRowingFocusTrap = () => {
  const { focusNext, focusPrev } = useFocusScope();

  const [focused, setFocused] = useState(1);

  const onKey = (event) => {
    if (event.key === 'ArrowDown') {
      focusNext({ onlyTabbable: false });
    }
    if (event.key === 'ArrowUp') {
      focusPrev({ onlyTabbable: false });
    }
  };


  return (
    <div onKeyDown={onKey} style={{ border: '1px solid black' }}>
      <ControlledFocusButton
        onFocus={() => setFocused(1)}
        isActive={focused === 1}
      >
        Button1
      </ControlledFocusButton>
      <ControlledFocusButton
        onFocus={() => setFocused(2)}
        isActive={focused === 2}
      >
        Button2
      </ControlledFocusButton>
      <ControlledFocusButton
        onFocus={() => setFocused(3)}
        isActive={focused === 3}
      >
        Button3
      </ControlledFocusButton>
      <ControlledFocusButton
        onFocus={() => setFocused(4)}
        isActive={focused === 4}
      >
        Button4
      </ControlledFocusButton>
    </div>
  );
};

export const ControlTrapExample = () => (
  <div>
    <FocusLock disabled>
      <ControlTrap />
    </FocusLock>
    <FocusLock disabled>
      <ControlTrap />
    </FocusLock>
  </div>
);

export const RowingFocusExample = () => (
  <FocusLock disabled>
    <RowingFocusTrap />
    <RowingFocusTrap />
  </FocusLock>
);

export const GroupRowingFocusExample = () => (
  <div>
    <FocusLock disabled>
      <ConstantRowingFocusTrap />
    </FocusLock>
    <FocusLock disabled>
      <ConstantRowingFocusTrap />
    </FocusLock>
  </div>
);
