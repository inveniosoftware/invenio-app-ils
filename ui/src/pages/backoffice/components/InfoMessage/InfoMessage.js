import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon, Message } from 'semantic-ui-react';

export default class InfoMessage extends Component {
  render() {
    return (
      <Message icon info data-test={'no-results'}>
        <Icon name="info circle" />
        <Message.Content>
          <Message.Header>{this.props.header}</Message.Header>
          <p>{this.props.content}</p>
        </Message.Content>
      </Message>
    );
  }
}

InfoMessage.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
