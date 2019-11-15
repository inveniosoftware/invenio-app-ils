import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DocumentCirculation } from '../DocumentCirculation';

import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '@components/ILSPlaceholder';
import {
  DocumentAbstract,
  DocumentCover,
  DocumentTags,
  DocumentTitle,
} from '@pages/frontsite/components/Document';
import { DocumentAuthors } from '@components/Document';

export default class DocumentPanelMobile extends Component {
  constructor(props) {
    super(props);
    this.document = props.documentDetails;
  }

  render() {
    const { isLoading } = this.props;
    return (
      <>
        <div
          className="document-panel"
          data-test={this.document.metadata ? this.document.metadata.pid : 0}
        >
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} textAlign={'center'}>
                <DocumentCover
                  imageSize={'medium'}
                  placeholderStyle={{ width: 350, height: 400 }}
                />
                <ILSHeaderPlaceholder isLoading={isLoading} center="true">
                  <DocumentTitle />
                </ILSHeaderPlaceholder>
                <ILSParagraphPlaceholder linesNumber={1} isLoading={isLoading}>
                  <DocumentAuthors
                    prefix={'by '}
                    listItemAs={'h4'}
                    metadata={this.props.documentDetails.metadata}
                  />
                </ILSParagraphPlaceholder>
                <ILSParagraphPlaceholder linesNumber={1} isLoading={isLoading}>
                  <DocumentTags />
                </ILSParagraphPlaceholder>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16}>
                <DocumentCirculation />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16}>
                <ILSParagraphPlaceholder linesNumber={5} isLoading={isLoading}>
                  <Header as={'h4'} content={'Abstract'} />
                  <DocumentAbstract lines={5} />
                </ILSParagraphPlaceholder>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </>
    );
  }
}

DocumentPanelMobile.propTypes = {
  documentDetails: PropTypes.object.isRequired,
};
