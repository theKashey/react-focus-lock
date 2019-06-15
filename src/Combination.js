import React from 'react';
import FocusLockUI from './Lock';
import FocusTrap from './Trap';

const FocusLockCombination = props => (
  <FocusLockUI
    sideCar={FocusTrap}
    {...props}
  />
);

const { sideCar, ...propTypes } = FocusLockUI.propTypes || {};

FocusLockCombination.propTypes = propTypes;

export default FocusLockCombination;
