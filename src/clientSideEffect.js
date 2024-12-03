/* eslint-disable no-unused-vars, no-console */

import React, { useEffect, useRef } from 'react';

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
      const lastProps = useRef(props);

      useEffect(() => {
        lastProps.current = props;
      });

      // handle mounted instances
      useEffect(() => {
        console.log('ins added');
        mountedInstances.push(lastProps);

        return () => {
          console.log('ins removed');
          const index = mountedInstances.indexOf(lastProps);
          mountedInstances.splice(index, 1);
        };
      }, []);

      // notify updates
      // useEffect(emitChange, [props.disabled]);

      return <WrappedComponent {...props} />;
    };

    return SideEffect;
  };
}

export default withSideEffect;
