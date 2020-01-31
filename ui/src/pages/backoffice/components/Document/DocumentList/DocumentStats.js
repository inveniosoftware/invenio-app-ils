import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class DocumentStats extends Component {
  render() {
    const { metadata } = this.props;
    return (
      <List verticalAlign="middle" style={{ color: '#aaa' }}>
        <List.Item>
          <List.Content floated="right">
            <Header style={{ color: '#aaa' }}>
              {metadata.loan_extensions}
            </Header>
          </List.Content>
          <List.Content>total extensions</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
            <Header as={Link} to={metadata.loan_count_url}>
              {metadata.loan_count}
            </Header>
          </List.Content>
          <List.Content>total loans</List.Content>
        </List.Item>
      </List>
    );
  }
}

DocumentStats.propTypes = {
  metadata: PropTypes.object.isRequired,
};
