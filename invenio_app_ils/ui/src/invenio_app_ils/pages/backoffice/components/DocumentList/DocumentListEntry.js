import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Header, Icon, Item, List } from 'semantic-ui-react';
import { getCover } from '../../../frontsite/config';
import { BackOfficeRoutes } from '../../../../routes/urls';
import _isEmpty from 'lodash/isEmpty';
import DocumentCirculation from './DocumentCirculation';
import {
  DocumentAuthors,
  DocumentLanguages,
  DocumentTags,
} from '../../../../common/components/Document';

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
            {!_isEmpty(document.metadata.relations.multipart_monograph) && (
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
            {!_isEmpty(document.metadata.relations.serial) && (
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
    if (_isEmpty(meta._access)) return null;
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

  renderPubYear = () => {
    const { document } = this.props;
    if (_isEmpty(document.metadata.imprints)) return null;
    return (
      <Item.Description>
        <label>Published</label> {document.metadata.imprints[0].date}
      </Item.Description>
    );
  };

  render() {
    const { document } = this.props;
    return (
      <Item>
        <div className={'item-image-addons-wrapper'}>
          <Item.Image
            as={Link}
            to={BackOfficeRoutes.documentDetailsFor(document.metadata.pid)}
            size={'tiny'}
            src={getCover(document.metadata.pid)}
            onError={e => (e.target.style.display = 'none')}
            label={this.getRestrictions(document.metadata)}
          />
          <Header disabled as="h6" className={'document-type'}>
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
          <Grid highlight={3}>
            <Grid.Column computer={6} largeScreen={5}>
              <Item.Meta className={'document-authors'}>
                <DocumentAuthors metadata={document.metadata} prefix={'by '} />
              </Item.Meta>
              <DocumentLanguages
                metadata={document.metadata}
                prefix={<label>languages </label>}
              />
              {this.renderEdition(document.metadata.edition)}
              {this.renderPubYear()}
            </Grid.Column>
            <Grid.Column computer={2} largeScreen={4}>
              {this.renderMiddleColumn(document)}
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column computer={3} largeScreen={4}>
              {this.renderRightColumn(document)}
            </Grid.Column>
          </Grid>
          <Item.Extra>
            <DocumentTags metadata={document.metadata} />
          </Item.Extra>
        </Item.Content>
        <Item.Meta className={'document-pid'}>
          <Header disabled as="h5" className={'document-pid'}>
            #{document.metadata.pid}
          </Header>
        </Item.Meta>
      </Item>
    );
  }
}

DocumentListEntry.propTypes = {
  document: PropTypes.object.isRequired,
  renderMiddleColumn: PropTypes.func,
  renderRightColumn: PropTypes.func,
};
