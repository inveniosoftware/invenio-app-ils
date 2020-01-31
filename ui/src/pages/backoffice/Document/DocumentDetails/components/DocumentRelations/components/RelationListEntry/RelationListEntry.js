import { DocumentAuthors } from '@components';
import { DocumentEdition, DocumentTitle } from '@components/Document';
import { getCover } from '@pages/frontsite/config';
import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Icon, Item, Label } from 'semantic-ui-react';

export class RelationListEntry extends Component {
  render() {
    const { document, extra, actions } = this.props;
    return (
      <Item className="relation-list-entry">
        {actions}
        <div className="item-image-wrapper">
          <Item.Image
            as={Link}
            to={BackOfficeRoutes.documentDetailsFor(document.metadata.pid)}
            size={'tiny'}
            src={getCover(document.metadata.edition)}
            onError={e => (e.target.style.display = 'none')}
          />
          <div className={'document-type discrete tiny ellipsis'}>
            {document.metadata.document_type}
          </div>
        </div>
        <Item.Content>
          <Item.Header
            as={Link}
            to={BackOfficeRoutes.documentDetailsFor(document.metadata.pid)}
            data-test={`navigate-${document.metadata.pid}`}
          >
            <DocumentTitle document={document} truncate={true} short={true} />
          </Item.Header>
          <Grid columns={2}>
            <Grid.Column width={10}>
              <Item.Meta className="document-authors">
                <DocumentAuthors metadata={document.metadata} prefix={'by '} />
                <DocumentEdition document={document} explicit={true} />
                <label>Published</label> {document.metadata.publication_year}
              </Item.Meta>
            </Grid.Column>
            <Grid.Column width={6}>
              <Item.Extra>{extra}</Item.Extra>
            </Grid.Column>
          </Grid>
        </Item.Content>
        <div className="pid-field">#{document.metadata.pid}</div>
      </Item>
    );
  }
}

RelationListEntry.propTypes = {
  document: PropTypes.object.isRequired,
  extra: PropTypes.node,
  actions: PropTypes.node,
};
