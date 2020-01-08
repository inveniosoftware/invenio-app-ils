import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

export class DocumentUrls extends Component {
  render() {
    const { urls } = this.props.document.metadata;
    return (
      <List bulleted>
        {urls.map((entry, idx) => (
          <List.Item key={idx}>
            <List.Content>
              <a href={entry.value}>{entry.description || entry.value}</a>
            </List.Content>
          </List.Item>
        ))}
      </List>
    );
  }
}

DocumentUrls.propTypes = {
  document: PropTypes.object.isRequired,
};
