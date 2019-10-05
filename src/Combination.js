import React from 'react';
import FocusLockUI from './Lock';
import FocusTrap from './Trap';

/* that would be a BREAKING CHANGE!
// delaying sidecar execution till the first usage
const RequireSideCar = (props) => {
  // eslint-disable-next-line global-require
  const SideCar = require('./Trap').default;
  return <SideCar {...props} />;
};
*/

const FocusLockCombination = props => (
  <FocusLockUI
    sideCar={FocusTrap}
    {...props}
  />
);

const { sideCar, ...propTypes } = FocusLockUI.propTypes || {};

FocusLockCombination.propTypes = propTypes;

export default FocusLockCombination;
