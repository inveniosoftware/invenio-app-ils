import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '@components/ILSPlaceholder';
import { SeriesTitle, SeriesAccess } from '@pages/frontsite/components/Series';
import { SeriesAuthors, SeriesImage } from '@components/Series';
import { Abstract } from '@components';

export default class SeriesPanelMobile extends Component {
  render() {
    const { isLoading, series } = this.props;
    return (
      <div
        className="series-panel"
        data-test={series.metadata ? series.metadata.pid : 0}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column mobile={16} textAlign="center">
              <SeriesImage metadata={series.metadata} size="medium" />
              <ILSHeaderPlaceholder isLoading={isLoading} center="true">
                <SeriesTitle />
              </ILSHeaderPlaceholder>
              <ILSParagraphPlaceholder linesNumber={1} isLoading={isLoading}>
                <SeriesAuthors
                  prefix="by "
                  itemProps={{ as: 'h4' }}
                  metadata={series.metadata}
                />
              </ILSParagraphPlaceholder>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16}>
              <SeriesAccess />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16}>
              <ILSParagraphPlaceholder linesNumber={5} isLoading={isLoading}>
                <Header as="h3" content="Abstract" />
                <Abstract lines={5} content={series.metadata.abstract} />
              </ILSParagraphPlaceholder>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

SeriesPanelMobile.propTypes = {
  series: PropTypes.object.isRequired,
};
