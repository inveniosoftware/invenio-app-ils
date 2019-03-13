import React from 'react';
import { Message } from 'semantic-ui-react';

export const DefaultFallbackComponent = ({ error, info }) => (
  <Message
    error
    header="UI Error"
    content="Something went wrong when rendering the component."
  />
);
