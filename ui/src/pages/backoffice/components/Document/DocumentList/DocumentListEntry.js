import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Header, Icon, Item, List } from 'semantic-ui-react';
import { getCover } from '@pages/frontsite/config';
import { BackOfficeRoutes } from '@routes/urls';
import isEmpty from 'lodash/isEmpty';
import DocumentCirculation from './DocumentCirculation';
import {
  DocumentAuthors,
  DocumentEdition,
  DocumentLanguages,
  DocumentTags,
} from '@components/Document';

export default class DocumentListEntry extends Component {
  renderMiddleColumn = document => {
    if (this.props.renderMiddleColumn) {
      return this.props.renderMiddleColumn(document);
    }
    return <DocumentCirculation document={document} />;
  };

  renderRightColumn = document => {
    if (this.props.renderRightColumn) {
      return this.props.renderRightColumn(document);
    }
    return this.renderRelations();
  };

  renderRelations = () => {
    const { document } = this.props;
    return (
      <>
        <Item.Description>
          <List verticalAlign={'middle'} className={'document-relations'}>
            {!isEmpty(document.metadata.relations.multipart_monograph) && (
              <List.Item>
                <List.Content floated="right">
                  <Link
                    to={BackOfficeRoutes.seriesDetailsFor(
                      document.metadata.relations.multipart_monograph[0].pid
                    )}
                  >
                    <Icon name={'paperclip'} />
                  </Link>
                </List.Content>
                <List.Content>Multipart monograph</List.Content>
              </List.Item>
            )}
            {!isEmpty(document.metadata.relations.serial) && (
              <List.Item>
                <List.Content floated={'right'}>
                  <Link
                    to={BackOfficeRoutes.seriesListWithQuery(
                      document.metadata.relations.serial
                        .map((entry, idx) =>
                          idx === document.metadata.relations.serial.length - 1
                            ? `pid: ${entry.pid}`
                            : `pid: ${entry.pid} OR`
                        )
                        .join(' ')
                    )}
                  >
                    <Icon name="search plus" />
                  </Link>
                </List.Content>
                <List.Content>Serials</List.Content>
              </List.Item>
            )}
            {document.metadata.eitems.total > 0 ? (
              <List.Item>
                <List.Content floated="right">
                  <Icon name="desktop" />
                </List.Content>
                <List.Content>Electronic version </List.Content>
              </List.Item>
            ) : null}
          </List>
        </Item.Description>
      </>
    );
  };

  getRestrictions = meta => {
    if (isEmpty(meta._access)) return null;
    return {
      corner: 'left',
      color: 'red',
      icon: 'lock',
      title: `This ${meta.document_type.toLowerCase()} is restricted`,
    };
  };

  renderEdition = edition => {
    if (!edition) return null;
    return (
      <Item.Description>
        <label>edition</label> {edition}
      </Item.Description>
    );
  };

  render() {
    const { document } = this.props;
    return (
      <Item>
        <div className={'item-image-wrapper'}>
          <Item.Image
            as={Link}
            to={BackOfficeRoutes.documentDetailsFor(document.metadata.pid)}
            size={'tiny'}
            src={getCover(document.metadata.edition)}
            onError={e => (e.target.style.display = 'none')}
            label={this.getRestrictions(document.metadata)}
          />
          <Header disabled as="h6" className={'document-type tiny ellipsis'}>
            {document.metadata.document_type}
          </Header>
        </div>
        <Item.Content>
          <Item.Header
            as={Link}
            to={BackOfficeRoutes.documentDetailsFor(document.metadata.pid)}
            data-test={`navigate-${document.metadata.pid}`}
          >
            {document.metadata.title}
          </Item.Header>
          <Grid columns={3}>
            <Grid.Column computer={6} largeScreen={5}>
              <Item.Meta className={'document-authors'}>
                <DocumentAuthors metadata={document.metadata} prefix={'by '} />
              </Item.Meta>
              <DocumentLanguages
                metadata={document.metadata}
                prefix={<label>languages </label>}
              />
              <DocumentEdition document={document} explicit={true} />
              <label>Published</label> {document.metadata.publication_year}
            </Grid.Column>
            <Grid.Column computer={3} largeScreen={4}>
              {this.renderMiddleColumn(document)}
            </Grid.Column>
            <Grid.Column computer={3} largeScreen={4}>
              {this.renderRightColumn(document)}
            </Grid.Column>
          </Grid>
          <Item.Extra>
            <DocumentTags metadata={document.metadata} />
          </Item.Extra>
        </Item.Content>
        <div className={'pid-field discrete'}>#{document.metadata.pid}</div>
      </Item>
    );
  }
}

DocumentListEntry.propTypes = {
  document: PropTypes.object.isRequired,
  renderMiddleColumn: PropTypes.func,
  renderRightColumn: PropTypes.func,
};
