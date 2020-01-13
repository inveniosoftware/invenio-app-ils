import { DocumentToc } from '@components/Document';
import { DocumentSubjects } from './DocumentSubjects';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Header } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import { Abstract } from '@components';

export class DocumentContents extends Component {
  render() {
    const { document } = this.props;
    return (
      <>
        <Header as="h3">Abstract</Header>
        <Abstract content={document.metadata.abstract} lines={10} />

        {!isEmpty(document.metadata.table_of_content) && (
          <>
            <Divider />
            <Header as="h3">Table of content</Header>
            <DocumentToc document={document} />
          </>
        )}

        {!isEmpty(document.metadata.subjects) && (
          <>
            <Divider />
            <Header as="h3">Subjects</Header>
            <DocumentSubjects document={document} />
          </>
        )}
      </>
    );
  }
}

DocumentContents.propTypes = {
  document: PropTypes.object.isRequired,
};
