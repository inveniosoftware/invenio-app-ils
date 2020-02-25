import { InfoMessage, MetadataTable } from '@pages/backoffice/components';
import { groupedSchemeValueList } from '@pages/backoffice/utils';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export class DocumentIdentifiers extends Component {
  render() {
    const { document } = this.props;
    return document.metadata.identifiers ? (
      <MetadataTable
        rows={groupedSchemeValueList(document.metadata.identifiers)}
      />
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
