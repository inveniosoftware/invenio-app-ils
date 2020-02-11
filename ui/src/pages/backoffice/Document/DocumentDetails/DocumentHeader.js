import { toShortDate } from '@api/date';
import { CopyButton, DocumentAuthors } from '@components';
import {
  DocumentCover,
  DocumentTags,
  DocumentTitle,
} from '@components/Document';
import { DetailsHeader } from '@pages/backoffice';
import { DocumentCreatedBy } from '@pages/backoffice/Document/DocumentDetails/components';
import React, { Component } from 'react';
import { Header, Icon, Label } from 'semantic-ui-react';

export class DocumentHeader extends Component {
  render() {
    const { data } = this.props;
    const recordInfo = (
      <>
        <label className="muted">Document</label> {data.metadata.pid}{' '}
        <CopyButton text={data.metadata.pid} />
        {data.metadata.created_by && (
          <>
            <br />
            <label className="muted">Created by</label>{' '}
            <DocumentCreatedBy metadata={data.metadata} />
          </>
        )}
        <br />
        <label className="muted">Created on</label> {toShortDate(data.created)}
        <br />
        {!data.metadata.open_access && (
          <Label size="large" color="red">
            <Icon name="lock" />
            Restricted access
          </Label>
        )}
      </>
    );
    return (
      <DetailsHeader
        title={
          <>
            <Header.Subheader>{data.metadata.document_type}</Header.Subheader>
            <DocumentTitle document={data} />
          </>
        }
        subTitle={<DocumentAuthors metadata={data.metadata} prefix={'by '} />}
        pid={data.metadata.pid}
        icon={<DocumentCover document={data} imageSize="huge" />}
        recordType="Document"
        recordInfo={recordInfo}
      >
        <DocumentTags metadata={data.metadata} />
      </DetailsHeader>
    );
  }
}
