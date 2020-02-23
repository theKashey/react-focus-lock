/* eslint-disable */

import * as React from 'react';

// NOT USED

function withSideEffect(reducePropsToState, handleStateChangeOnClient) {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof reducePropsToState !== 'function') {
      throw new Error('Expected reducePropsToState to be a function.');
    }

    if (typeof handleStateChangeOnClient !== 'function') {
      throw new Error('Expected handleStateChangeOnClient to be a function.');
    }
  }

  return function wrap(WrappedComponent) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof WrappedComponent !== 'function') {
        throw new Error('Expected WrappedComponent to be a React component.');
      }
    }

    const mountedInstances = [];

    function emitChange() {
      console.log('emitting');
      const state = reducePropsToState(mountedInstances.map(instance => instance.current));
      handleStateChangeOnClient(state);
    }

    const SideEffect = (props) => {
      const lastProps = React.useRef(props);

      React.useEffect(() => {
        lastProps.current = props;
      });

      // handle mounted instances
      React.useEffect(() => {
        console.log('ins added');
        mountedInstances.push(lastProps);

        return () => {
          console.log('ins removed');
          const index = mountedInstances.indexOf(lastProps);
          mountedInstances.splice(index, 1);
        };
      }, []);

      // notify updates
      // React.useEffect(emitChange, [props.disabled]);

      return <WrappedComponent {...props} />;
    };

    return SideEffect;
  };
}

export default withSideEffect;
