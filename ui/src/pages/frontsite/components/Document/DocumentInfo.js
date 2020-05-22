import { DocumentAuthors } from '@components/Document';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Divider, Table } from 'semantic-ui-react';
import { IdentifierRows } from '../Identifiers';

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

  renderKeywords() {
    const keywordsValue = _get(this.metadata, 'keywords.value');
    const keywordsSource = _get(this.metadata, 'keywords.source');
    const keywords =
      keywordsValue && keywordsSource
        ? `${keywordsValue} (${keywordsSource})`
        : keywordsValue
        ? keywordsValue
        : '';
    return keywords ? (
      <Table.Row>
        <Table.Cell>Keywords</Table.Cell>
        <Table.Cell>{keywords}</Table.Cell>
      </Table.Row>
    ) : null;
  }

  renderSpecificIdentifiers(scheme) {
    const identifiers = this.metadata.identifiers
      ? this.metadata.identifiers.filter(
          identifier => identifier.scheme === scheme
        )
      : [];

    if (identifiers.length > 0) {
      return <IdentifierRows identifiers={identifiers} />;
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
                <DocumentAuthors
                  metadata={this.metadata}
                  popupDisplay={true}
                  authorsLimit={3}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Edition</Table.Cell>
              <Table.Cell>{this.metadata.edition}</Table.Cell>
            </Table.Row>
            {this.renderLanguages()}
            {this.renderKeywords()}
            {this.renderSpecificIdentifiers('ISBN')}
            {this.renderSpecificIdentifiers('DOI')}
          </Table.Body>
        </Table>
      </>
    );
  }
}

DocumentInfo.propTypes = {
  metadata: PropTypes.object.isRequired,
};
