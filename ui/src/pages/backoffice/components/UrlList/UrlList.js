import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

export class UrlList extends Component {
  render() {
    const { urls } = this.props;
    if (isEmpty(urls)) {
      return null;
    }
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

UrlList.propTypes = {
  urls: PropTypes.array.isRequired,
};
