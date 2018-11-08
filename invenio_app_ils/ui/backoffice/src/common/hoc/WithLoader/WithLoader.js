import React from 'react';
import { Loader } from 'semantic-ui-react';

function ApiLoader(props) {
  return <Loader active size="huge" inline="centered" />;
}

export function withLoader(WrappedComponent) {
  return function WithLoader({ isLoading, ...props }) {
    return isLoading ? <ApiLoader /> : <WrappedComponent {...props} />;
  };
}
