import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

export const EmptyMessage = ({ children, message, show, title }) => {
  return show ? (
    children
  ) : (
    <Message info icon>
      {title && <Message.Header>{title}</Message.Header>}
      {message}
    </Message>
  );
};

EmptyMessage.propTypes = {
  message: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired,
  title: PropTypes.node,
};
