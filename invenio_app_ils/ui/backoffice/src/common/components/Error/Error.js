import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Message } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

export class Error extends Component {
  _messageFromStatus = (errorMessage, status) => {
    let message;
    switch (status) {
      case 401:
        message = 'You are not authenticated. Please login first.';
        break;
      case 403:
        message = 'You are not authorized to perform this action.';
        break;
      case 404:
        message = 'The requested URL has not been found.';
        break;
      default:
        message = errorMessage;
    }
    return message;
  };

  render() {
    const error = this.props.error;
    if (!_isEmpty(error)) {
      const message = this._messageFromStatus(
        error.message,
        error.response ? error.response.status : undefined
      );
      return (
        <Container>
          <Message
            compact
            icon="exclamation"
            header="Oups, request to REST API failed!"
            content={message}
          />
        </Container>
      );
    } else {
      return this.props.children;
    }
  }
}

Error.propTypes = {
  error: PropTypes.object,
};
