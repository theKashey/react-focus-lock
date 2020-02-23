import * as React from 'react';
import PropTypes from 'prop-types';
import * as constants from 'focus-lock/constants';
import { inlineProp } from './util';
import { mediumEffect } from './medium';

function MoveFocusInside({ disabled: isDisabled, className, children }) {
  const ref = React.useRef(null);
  const disabled = React.useRef(isDisabled);
  const moveFocus = () => {
    const observed = ref.current;
    mediumEffect.useMedium((car) => {
      if (!disabled.current && observed) {
        if (!car.focusInside(observed)) {
          car.moveFocusInside(observed, null);
        }
      }
    });
  };

  React.useEffect(() => {
    disabled.current = isDisabled;
    moveFocus();
  }, [isDisabled]);

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

MoveFocusInside.defaultProps = {
  disabled: false,
  className: undefined,
};

export default MoveFocusInside;
