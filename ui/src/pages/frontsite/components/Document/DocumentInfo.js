import React, { Component } from 'react';
import { Divider, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DocumentAuthors } from '@components/Document';

export class DocumentInfo extends Component {
  constructor(props) {
    super(props);
    this.metadata = props.metadata;
  }

  renderLanguages() {
    if (this.metadata.languages) {
      return (
        <Table.Row>
          <Table.Cell>Languages</Table.Cell>
          <Table.Cell>
            {this.metadata.languages.map(lang => lang + ', ')}
          </Table.Cell>
        </Table.Row>
      );
    }
    return null;
  }

  render() {
    return (
      <>
        <Divider horizontal>Details</Divider>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Title</Table.Cell>
              <Table.Cell>{this.metadata.title}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Authors</Table.Cell>
              <Table.Cell>
                <DocumentAuthors metadata={this.metadata} />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Edition</Table.Cell>
              <Table.Cell>{this.metadata.edition}</Table.Cell>
            </Table.Row>
            {this.renderLanguages()}
            <Table.Row>
              <Table.Cell>Keywords</Table.Cell>
              <Table.Cell>
                {this.metadata.keywords.value} ({this.metadata.keywords.source})
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>
    );
  }
}

DocumentInfo.propTypes = {
  metadata: PropTypes.object.isRequired,
};
