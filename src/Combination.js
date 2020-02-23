import * as React from 'react';
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

const FocusLockCombination = React.forwardRef((props, ref) => (
  <FocusLockUI
    sideCar={FocusTrap}
    ref={ref}
    {...props}
  />
));

const { sideCar, ...propTypes } = FocusLockUI.propTypes || {};

FocusLockCombination.propTypes = propTypes;

export default FocusLockCombination;
