import { InfoMessage, MetadataTable } from '@pages/backoffice';
import { groupedSchemeValueList } from '@pages/backoffice/utils';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class DocumentIdentifiers extends Component {
  render() {
    const { document } = this.props;
    const identifiers = groupedSchemeValueList(document.metadata.identifiers);
    const alternative_identifiers = groupedSchemeValueList(
      document.metadata.alternative_identifiers
    );
    return document.metadata.identifiers ? (
      <MetadataTable rows={identifiers.concat(alternative_identifiers)} />
    ) : (
      <InfoMessage
        header={'No stored identifiers.'}
        content={'Edit document to add identifiers'}
      />
    );
  }
}

DocumentIdentifiers.propTypes = {
  document: PropTypes.object.isRequired,
};
