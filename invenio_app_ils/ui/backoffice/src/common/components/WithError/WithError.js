import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';

class ApiError extends Component {
  render() {
    return (
      <Message
        icon="exclamation"
        header="Oups, failed to fetch data from API!"
        content={this.props.error.message}
      />
    );
  }
}

export function withError(WrappedComponent) {
  return function WithError({ error, ...props }) {
    if (error) return <ApiError error={error} />;
    return <WrappedComponent {...props} />;
  };
}
