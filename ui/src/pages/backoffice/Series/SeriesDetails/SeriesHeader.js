import { toShortDate } from '@api/date';
import {
  CopyButton,
  CreatedBy,
  LiteratureCover,
  SeriesAuthors,
} from '@components';
import { DocumentTags, DocumentTitle } from '@components/Document';
import { DetailsHeader } from '@pages/backoffice/components';
import { FrontSiteRoutes } from '@routes/urls';
import _get from 'lodash/get';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';

export class SeriesHeader extends Component {
  render() {
    const { data } = this.props;
    const recordInfo = (
      <>
        <label className="muted">Series</label> {data.metadata.pid}{' '}
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
        <Link to={FrontSiteRoutes.seriesDetailsFor(data.metadata.pid)}>
          public view <Icon name="linkify" />
        </Link>
      </>
    );
    return (
      <DetailsHeader
        title={
          <>
            <Header.Subheader>
              {data.metadata.mode_of_issuance}
            </Header.Subheader>
            <DocumentTitle metadata={data.metadata} />
          </>
        }
        subTitle={<SeriesAuthors metadata={data.metadata} prefix={'by '} />}
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
