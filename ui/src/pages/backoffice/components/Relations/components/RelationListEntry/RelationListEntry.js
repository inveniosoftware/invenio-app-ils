import { recordToPidType } from '@api/utils';
import { DocumentAuthors, SeriesAuthors } from '@components';
import {
  DocumentEdition,
  DocumentItemCover,
  DocumentTitle,
} from '@components/Document';
import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Icon, Item } from 'semantic-ui-react';

export class RelationListEntry extends Component {
  render() {
    const { record, extra, actions } = this.props;
    const recordType = recordToPidType(record);
    const linkTo =
      recordType === 'docid'
        ? BackOfficeRoutes.documentDetailsFor(record.metadata.pid)
        : BackOfficeRoutes.seriesDetailsFor(record.metadata.pid);
    const cover =
      recordType === 'docid' ? (
        <DocumentItemCover document={record} linkTo={linkTo} />
      ) : (
        <Icon name="clone outline" size="huge" color="grey" />
      );
    return (
      <Item className="relation-list-entry">
        {actions}
        <div className="item-image-wrapper">
          {cover}
          <div className={'document-type discrete tiny ellipsis'}>
            {record.metadata.document_type || record.metadata.mode_of_issuance}
          </div>
        </div>
        <Item.Content>
          <Item.Header
            as={Link}
            target="_blank"
            to={BackOfficeRoutes.documentDetailsFor(record.metadata.pid)}
            data-test={`navigate-${record.metadata.pid}`}
          >
            <DocumentTitle document={record} truncate={true} short={true} />
          </Item.Header>
          <Grid columns={2}>
            <Grid.Column width={10}>
              <Item.Meta className="document-authors">
                {recordType === 'docid' ? (
                  <DocumentAuthors metadata={record.metadata} prefix={'by '} />
                ) : (
                  <SeriesAuthors metadata={record.metadata} />
                )}
                <DocumentEdition document={record} label={true} />
                <label>Published</label> {record.metadata.publication_year}
              </Item.Meta>
            </Grid.Column>
            <Grid.Column width={6}>
              <Item.Extra>{extra}</Item.Extra>
            </Grid.Column>
          </Grid>
        </Item.Content>
        <div className="pid-field">#{record.metadata.pid}</div>
      </Item>
    );
  }
}

RelationListEntry.propTypes = {
  record: PropTypes.object.isRequired,
  extra: PropTypes.node,
  actions: PropTypes.node,
};
