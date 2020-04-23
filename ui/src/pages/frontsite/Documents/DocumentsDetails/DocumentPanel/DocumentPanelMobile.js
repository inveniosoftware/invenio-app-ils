import { Abstract } from '@components';
import { DocumentAuthors, DocumentCover } from '@components/Document';
import { ILSHeaderPlaceholder, ILSParagraphPlaceholder } from '@components/ILSPlaceholder';
import { DocumentTags, DocumentTitle } from '@pages/frontsite/components/Document';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { DocumentCirculation } from '../DocumentCirculation';

export default class DocumentPanelMobile extends Component {
  render() {
    const { documentDetails: doc, isLoading } = this.props;
    return (
      <div
        className="document-panel"
        data-test={doc.metadata ? doc.metadata.pid : 0}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column mobile={16} textAlign={'center'}>
              <DocumentCover
                imageSize={'medium'}
                placeholderStyle={{ width: 350, height: 400 }}
                coverUrl={_get(doc, 'metadata.cover_metadata.urls.large')}
              />
              <ILSHeaderPlaceholder isLoading={isLoading} center="true">
                <DocumentTitle />
              </ILSHeaderPlaceholder>
              <ILSParagraphPlaceholder linesNumber={1} isLoading={isLoading}>
                <DocumentAuthors
                  prefix={'by '}
                  listItemAs={'h4'}
                  metadata={doc.metadata}
                />
              </ILSParagraphPlaceholder>
              <ILSParagraphPlaceholder linesNumber={1} isLoading={isLoading}>
                <DocumentTags />
              </ILSParagraphPlaceholder>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16}>
              <DocumentCirculation
                documentDetails={this.props.documentDetails}
                isLoading={isLoading}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16}>
              <ILSParagraphPlaceholder linesNumber={5} isLoading={isLoading}>
                <Header as={'h4'} content={'Abstract'} />
                <Abstract lines={5} content={doc.metadata.abstract} />
              </ILSParagraphPlaceholder>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

DocumentPanelMobile.propTypes = {
  documentDetails: PropTypes.object.isRequired,
};
