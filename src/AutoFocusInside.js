import React from 'react';
import PropTypes from 'prop-types';
import * as constants from 'focus-lock/constants';
import { inlineProp } from './util';

const AutoFocusInside = ({ disabled, children, className }) => (
  <div {...inlineProp(constants.FOCUS_AUTO, !disabled)} className={className}>
    {children}
  </div>
);

AutoFocusInside.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

AutoFocusInside.defaultProps = {
  disabled: false,
  className: undefined,
};

export default AutoFocusInside;
