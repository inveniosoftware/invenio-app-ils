import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon, Message } from 'semantic-ui-react';

export default class InfoMessage extends Component {
  render() {
    const { header, content, children, ...uiProps } = this.props;
    return (
      <Message icon info data-test={'no-results'} {...uiProps}>
        <Icon name="info circle" />
        <Message.Content>
          <Message.Header>{header}</Message.Header>
          <p>{content}</p>
          {children}
        </Message.Content>
      </Message>
    );
  }
}

InfoMessage.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.string,
};
