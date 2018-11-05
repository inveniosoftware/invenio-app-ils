import React from 'react';
import { Message } from 'semantic-ui-react';

function ApiError(props) {
  return (
    <Message
      icon="exclamation"
      header="Oups, failed to fetch data from API!"
      content={props.error.message}
    />
  );
}

export function withError(WrappedComponent) {
  return function WithError({ error, ...props }) {
    if (error) return <ApiError error={error} />;
    return <WrappedComponent {...props} />;
  };
}
