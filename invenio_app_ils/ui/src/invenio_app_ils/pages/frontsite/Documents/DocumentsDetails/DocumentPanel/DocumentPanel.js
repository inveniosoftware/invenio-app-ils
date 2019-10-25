import React, { Component } from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DocumentCirculation } from '../DocumentCirculation';

import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '../../../../../common/components/ILSPlaceholder';
import {
  DocumentAbstract,
  DocumentAuthors,
  DocumentCover,
  DocumentTitle,
} from '../../../components/Document';
import { DocumentPanelMobile } from './index';

export default class DocumentPanel extends Component {
  constructor(props) {
    super(props);
    this.document = props.documentDetails;
  }

  render() {
    const { isLoading } = this.props;
    return (
      <>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <div
            className="document-panel"
            data-test={this.document.metadata ? this.document.metadata.pid : 0}
          >
            <Grid columns={3}>
              <Grid.Row>
                <Grid.Column>
                  <DocumentCover />
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
                      metadata={this.props.documentDetails.metadata}
                    />
                  </ILSParagraphPlaceholder>
                  <ILSParagraphPlaceholder
                    linesNumber={20}
                    isLoading={isLoading}
                  >
                    <DocumentAbstract lines={20} />
                  </ILSParagraphPlaceholder>
                </Grid.Column>
                <Grid.Column>
                  <DocumentCirculation />
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
