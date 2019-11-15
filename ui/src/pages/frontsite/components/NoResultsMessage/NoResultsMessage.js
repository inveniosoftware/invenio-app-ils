import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon, Message } from 'semantic-ui-react';

export default class NoResultsMessage extends Component {
  render() {
    return (
      <Message icon info data-test={'no-results'}>
        <Icon name="info circle" />
        <Message.Content>
          <Message.Header>{this.props.messageHeader}</Message.Header>
          <p>{this.props.messageContent}</p>
        </Message.Content>
      </Message>
    );
  }
}

NoResultsMessage.propTypes = {
  messageHeader: PropTypes.string.isRequired,
  messageContent: PropTypes.string.isRequired,
};
