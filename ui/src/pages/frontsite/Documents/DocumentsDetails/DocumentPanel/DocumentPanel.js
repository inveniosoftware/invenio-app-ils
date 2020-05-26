import { Abstract, LiteratureCover } from '@components';
import { DocumentAuthors } from '@components/Document';
import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '@components/ILSPlaceholder';
import { DocumentTitle } from '@pages/frontsite/components/Document';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import { DocumentCirculation } from '../DocumentCirculation';
import { DocumentPanelMobile } from './index';

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
                  <LiteratureCover
                    url={_get(doc, 'metadata.cover_metadata.urls.large')}
                  />
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
                      authorsLimit={10}
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
