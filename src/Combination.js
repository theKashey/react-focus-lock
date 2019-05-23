import React from 'react';
import FocusLockUI from './Lock';
import FocusTrap from './Trap';

const FocusLockCombination = (props) => (
  <FocusLockUI
    sideCar={FocusTrap}
    {...props}
  />
);

FocusLockCombination.propTypes = FocusLockUI.propTypes;

export default FocusLockCombination;