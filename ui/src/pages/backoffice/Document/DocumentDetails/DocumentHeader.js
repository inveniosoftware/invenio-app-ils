import { toShortDate } from '@api/date';
import {
  CopyButton,
  CreatedBy,
  DocumentAuthors,
  LiteratureCover,
} from '@components';
import { DocumentTags, DocumentTitle } from '@components/Document';
import {
  DetailsHeader,
  RestrictedAccessLabel,
} from '@pages/backoffice/components';
import { FrontSiteRoutes } from '@routes/urls';
import _get from 'lodash/get';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';

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
            <CreatedBy metadata={data.metadata} />
          </>
        )}
        <br />
        <label className="muted">Created on</label> {toShortDate(data.created)}
        <br />
        <RestrictedAccessLabel isRestricted={data.metadata.restricted} />
        <Link to={FrontSiteRoutes.documentDetailsFor(data.metadata.pid)}>
          public view <Icon name="linkify" />
        </Link>
      </>
    );
    return (
      <DetailsHeader
        title={
          <>
            <Header.Subheader>{data.metadata.document_type}</Header.Subheader>
            <DocumentTitle metadata={data.metadata} />
          </>
        }
        subTitle={
          <DocumentAuthors
            metadata={data.metadata}
            prefix={'by '}
            authorsLimit={10}
          />
        }
        pid={data.metadata.pid}
        image={
          <LiteratureCover
            size="tiny"
            url={_get(data, 'metadata.cover_metadata.urls.medium')}
          />
        }
        recordInfo={recordInfo}
      >
        <DocumentTags metadata={data.metadata} />
      </DetailsHeader>
    );
  }
}
