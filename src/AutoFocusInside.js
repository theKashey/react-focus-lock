import React from 'react';
import PropTypes from 'prop-types';
import { FOCUS_AUTO } from 'focus-lock/constants';
import { inlineProp } from './util';

const AutoFocusInside = ({ disabled = false, children, className = undefined }) => (
  <div {...inlineProp(FOCUS_AUTO, !disabled)} className={className}>
    {children}
  </div>
);

AutoFocusInside.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default AutoFocusInside;
