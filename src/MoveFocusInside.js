import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FOCUS_AUTO } from 'focus-lock/constants';
import { inlineProp } from './util';
import { mediumEffect } from './medium';

export const useFocusInside = (observedRef) => {
  useEffect(() => {
    let enabled = true;
    mediumEffect.useMedium((car) => {
      const observed = observedRef && observedRef.current;
      if (enabled && observed) {
        if (!car.focusInside(observed)) {
          car.moveFocusInside(observed, null);
        }
      }
    });
    return () => {
      enabled = false;
    };
  }, [observedRef]);
};

function MoveFocusInside({ disabled: isDisabled = false, className, children }) {
  const ref = useRef(null);
  useFocusInside(isDisabled ? undefined : ref);

  return (
    <div
      {...inlineProp(FOCUS_AUTO, !isDisabled)}
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
}

MoveFocusInside.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default MoveFocusInside;
