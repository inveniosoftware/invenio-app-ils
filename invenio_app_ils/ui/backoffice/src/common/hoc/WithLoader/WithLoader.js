import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';

class ApiLoader extends Component {
  render() {
    return <Loader active size="huge" inline="centered" />;
  }
}

export function withLoader(WrappedComponent) {
  return function WithLoader({ isLoading, ...props }) {
    return isLoading ? <ApiLoader /> : <WrappedComponent {...props} />;
  };
}
