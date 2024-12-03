import React from 'react';
import PropTypes from 'prop-types';
import { FOCUS_ALLOW } from 'focus-lock/constants';
import { inlineProp } from './util';

const FreeFocusInside = ({ children, className }) => (
  <div {...inlineProp(FOCUS_ALLOW, true)} className={className}>
    {children}
  </div>
);

FreeFocusInside.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default FreeFocusInside;
