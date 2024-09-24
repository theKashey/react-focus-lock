import * as React from 'react';
import PropTypes from 'prop-types';
import * as constants from 'focus-lock/constants';
import { inlineProp } from './util';

const FreeFocusInside = ({ children, className }) => (
  <div {...inlineProp(constants.FOCUS_ALLOW, true)} className={className}>
    {children}
  </div>
);

FreeFocusInside.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default FreeFocusInside;
