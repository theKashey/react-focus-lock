import React from 'react';
import PropTypes from 'prop-types';
import * as constants from 'focus-lock/constants';
import { inlineProp } from './util';
import { mediumEffect } from './medium';

function MoveFocusInside(props) {
  const ref = React.useRef(null);
  const disabled = React.useRef(props.disabled);
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

  React.useLayoutEffect(() => {
    disabled.current = props.disabled;
    moveFocus();
  }, [props.disabled]);

  return (
    <div
      {...inlineProp(constants.FOCUS_AUTO, !props.disabled)}
      ref={ref}
      className={props.className}
    >
      {props.children}
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
