import {
  DocumentLanguages,
  DocumentTags,
  DocumentUrls,
} from '@components/Document';
import { MetadataTable } from '@pages/backoffice';
import { BackOfficeRoutes } from '@routes/urls';
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class DocumentMetadataGeneral extends Component {
  prepareGeneral = () => {
    const { document } = this.props;
    const rows = [
      { name: 'Title', value: document.metadata.title },
      {
        name: 'Authors',
        value: document.metadata.authors
          ? document.metadata.authors.map(author => author.full_name).join(',')
          : '',
      },
      {
        name: 'Keywords',
        value: document.metadata.keywords
          ? `${document.metadata.keywords.value} (${document.metadata.keywords.source})`
          : null,
      },
      {
        name: 'Tags',
        value: <DocumentTags size="mini" metadata={document.metadata} />,
      },
      {
        name: 'Edition',
        value: document.metadata.edition,
      },
      {
        name: 'Languages',
        value: <DocumentLanguages metadata={document.metadata} />,
      },
      {
        name: 'Urls',
        value: <DocumentUrls document={document} />,
      },
    ];

    const request = document.metadata.request;
    if (!isEmpty(request)) {
      rows.push({
        name: 'Document Request',
        value: (
          <Link to={BackOfficeRoutes.documentRequestDetailsFor(request.pid)}>
            {request.state}
          </Link>
        ),
      });
    }
    return rows;
  };

  render() {
    return (
      <>
        <MetadataTable rows={this.prepareGeneral()} />
      </>
    );
  }
}

DocumentMetadataGeneral.propTypes = {
  document: PropTypes.object.isRequired,
};
