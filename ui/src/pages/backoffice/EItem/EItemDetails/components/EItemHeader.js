import { toShortDate } from '@api/date';
import { CopyButton, DocumentAuthors } from '@components';
import { DocumentTitle } from '@components/Document';
import {
  DetailsHeader,
  DocumentIcon,
  EItemIcon,
  RestrictedLabel,
} from '@pages/backoffice';
import { BackOfficeRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class EItemHeader extends Component {
  render() {
    const { data } = this.props;
    const recordInfo = (
      <>
        <label className="muted">Electronic copy</label> {data.metadata.pid}{' '}
        <CopyButton text={data.metadata.pid} />
        <br />
        <label className="muted">Created on</label> {toShortDate(data.created)}
        <br />
        <Link
          to={BackOfficeRoutes.documentDetailsFor(data.metadata.document_pid)}
        >
          see document <DocumentIcon />
        </Link>
        <br />
        <RestrictedLabel openAccess={data.metadata.open_access} />
      </>
    );
    return (
      <DetailsHeader
        title={
          <>
            {data.metadata.pid}:{' '}
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
        icon={<EItemIcon />}
        recordType="Document"
        recordInfo={recordInfo}
      />
    );
  }
}

EItemHeader.propTypes = {
  data: PropTypes.object.isRequired,
};
