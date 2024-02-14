import * as React from 'react';
import PropTypes from 'prop-types';
import * as constants from 'focus-lock/constants';
import { inlineProp } from './util';
import { mediumEffect } from './medium';
import { requireSideCar } from './require-side-car';

export const useFocusInside = (observedRef) => {
  React.useEffect(() => {
    let enabled = true;
    requireSideCar();
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
  const ref = React.useRef(null);
  useFocusInside(isDisabled ? undefined : ref);

  return (
    <div
      {...inlineProp(constants.FOCUS_AUTO, !isDisabled)}
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
