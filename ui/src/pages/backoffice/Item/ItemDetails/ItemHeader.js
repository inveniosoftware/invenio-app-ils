import { toShortDate } from '@api/date';
import { CopyButton, DocumentAuthors } from '@components';
import { DocumentTitle } from '@components/Document';
import {
  DetailsHeader,
  DocumentIcon,
  ItemIcon,
} from '@pages/backoffice/components';
import { BackOfficeRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

export class ItemHeader extends Component {
  render() {
    const { data } = this.props;
    const recordInfo = (
      <>
        <label className="muted">Physical copy</label> {data.metadata.pid}{' '}
        <CopyButton text={data.metadata.pid} />
        <br />
        <label className="muted">Created on</label> {toShortDate(data.created)}
        <br />
        <Link
          to={BackOfficeRoutes.documentDetailsFor(data.metadata.document_pid)}
        >
          see document <DocumentIcon />
        </Link>
      </>
    );
    return (
      <DetailsHeader
        title={
          <>
            <Header.Subheader>Medium: {data.metadata.medium}</Header.Subheader>
            {data.metadata.barcode}:{' '}
            <DocumentTitle
              document={data.metadata.document}
              short={true}
              truncate={true}
            />
          </>
        }
        subTitle={
          <>
            <DocumentAuthors metadata={data.metadata.document} prefix={'by '} />
          </>
        }
        pid={data.metadata.pid}
        icon={<ItemIcon />}
        recordType="Document"
        recordInfo={recordInfo}
      />
    );
  }
}

ItemHeader.propTypes = {
  data: PropTypes.object.isRequired,
};
