import React from 'react';
import PropTypes from 'prop-types';
import { constants } from 'focus-lock';

const FreeFocusInside = ({ children, className }) => (
  <div {...{ [constants.FOCUS_ALLOW]: true }} className={className}>
    {children}
  </div>
);

FreeFocusInside.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

FreeFocusInside.defaultProps = {
  disabled: false,
  className: undefined,
};

export default FreeFocusInside;
