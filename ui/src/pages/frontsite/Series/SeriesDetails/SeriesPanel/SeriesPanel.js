import React, { Component } from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '@components/ILSPlaceholder';
import { SeriesTitle, SeriesAccess } from '@pages/frontsite/components/Series';
import { SeriesPanelMobile } from './index';
import { SeriesAuthors, SeriesImage } from '@components/Series';
import { Abstract } from '@components';

export default class SeriesPanel extends Component {
  render() {
    const { isLoading, series } = this.props;
    return (
      <>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <div
            className="series-panel"
            data-test={series.metadata ? series.metadata.pid : 0}
          >
            <Grid>
              <Grid.Row>
                <Grid.Column width={5}>
                  <SeriesImage fluid metadata={series.metadata} />
                </Grid.Column>
                <Grid.Column width={6}>
                  <ILSHeaderPlaceholder isLoading={isLoading}>
                    <SeriesTitle />
                  </ILSHeaderPlaceholder>
                  <ILSParagraphPlaceholder
                    linesNumber={1}
                    isLoading={isLoading}
                  >
                    <SeriesAuthors
                      prefix="by "
                      itemProps={{ as: 'h4' }}
                      metadata={series.metadata}
                    />
                  </ILSParagraphPlaceholder>
                  <ILSParagraphPlaceholder
                    linesNumber={20}
                    isLoading={isLoading}
                  >
                    <Abstract lines={20} content={series.metadata.abstract} />
                  </ILSParagraphPlaceholder>
                </Grid.Column>
                <Grid.Column width={5}>
                  <SeriesAccess />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <SeriesPanelMobile />
        </Responsive>
      </>
    );
  }
}

SeriesPanel.propTypes = {
  isLoading: PropTypes.bool,
  series: PropTypes.object.isRequired,
};
