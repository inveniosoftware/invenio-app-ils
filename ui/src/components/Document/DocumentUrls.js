import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import get from 'lodash/get';

export class DocumentUrls extends Component {
  render() {
    const urls = get(this.props, 'document.metadata.urls', []);
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
