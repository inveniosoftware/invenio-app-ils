import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

export class DocumentToc extends Component {
  render() {
    const tableOfContent = this.props.document.metadata.table_of_content;
    return (
      <List ordered>
        {tableOfContent.map((entry, index) => (
          <List.Item key={index}>{entry}</List.Item>
        ))}
      </List>
    );
  }
}

DocumentToc.propTypes = {
  document: PropTypes.object.isRequired,
};
