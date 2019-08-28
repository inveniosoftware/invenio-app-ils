import React, { Component } from 'react';
import { Header, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class BookInfo extends Component {
  render() {
    const { documentMetadata } = this.props;
    return (
      <div className="document-info">
        <Header as="h2">{documentMetadata.title.title}</Header>
        <List>
          {documentMetadata.authors.map((author, index) => (
            <List.Item as="h4" key={`Key${index}`}>
              Author: {author.full_name}
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}

BookInfo.propTypes = {
  documentMetadata: PropTypes.object.isRequired,
};
