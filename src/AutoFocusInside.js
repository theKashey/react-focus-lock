import React from 'react';
import PropTypes from 'prop-types';

const AutoFocusInside = ({ disabled, children }) => (
  <div data-autofocus-inside={!disabled}>
    {children}
  </div>
);

AutoFocusInside.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

AutoFocusInside.defaultProps = {
  disabled: false,
};

export default AutoFocusInside;
