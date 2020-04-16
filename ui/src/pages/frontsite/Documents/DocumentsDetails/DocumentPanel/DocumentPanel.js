import React, { Component } from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DocumentCirculation } from '../DocumentCirculation';
import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '@components/ILSPlaceholder';
import { DocumentTitle } from '@pages/frontsite/components/Document';
import { DocumentPanelMobile } from './index';
import { DocumentAuthors, DocumentCover } from '@components/Document';
import { Abstract } from '@components';

export default class DocumentPanel extends Component {
  render() {
    const { documentDetails: doc, isLoading } = this.props;
    return (
      <>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <div
            className="document-panel"
            data-test={doc.metadata ? doc.metadata.pid : 0}
          >
            <Grid columns={3}>
              <Grid.Row>
                <Grid.Column>
                  <DocumentCover document={doc} />
                </Grid.Column>
                <Grid.Column>
                  <ILSHeaderPlaceholder isLoading={isLoading}>
                    <DocumentTitle />
                  </ILSHeaderPlaceholder>
                  <ILSParagraphPlaceholder
                    linesNumber={1}
                    isLoading={isLoading}
                  >
                    <DocumentAuthors
                      prefix={'by '}
                      listItemAs={'h4'}
                      metadata={doc.metadata}
                    />
                  </ILSParagraphPlaceholder>
                  <ILSParagraphPlaceholder
                    linesNumber={20}
                    isLoading={isLoading}
                  >
                    <Abstract lines={20}>{doc.metadata.abstract}</Abstract>
                  </ILSParagraphPlaceholder>
                </Grid.Column>
                <Grid.Column>
                  <DocumentCirculation
                    documentDetails={this.props.documentDetails}
                    isLoading={isLoading}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <DocumentPanelMobile />
        </Responsive>
      </>
    );
  }
}

DocumentPanel.propTypes = {
  documentDetails: PropTypes.object.isRequired,
};
