import React from 'react';
import PropTypes from 'prop-types';
import { constants } from 'focus-lock';
import { inlineProp } from './util';

const FreeFocusInside = ({ children, className }) => (
  <div {...inlineProp(constants.FOCUS_ALLOW, true)} className={className}>
    {children}
  </div>
);

if (process.env.NODE_ENV !== 'production') {
  FreeFocusInside.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };
}

FreeFocusInside.defaultProps = {
  disabled: false,
  className: undefined,
};

export default FreeFocusInside;
