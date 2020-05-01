import { Abstract, LiteratureCover } from '@components';
import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '@components/ILSPlaceholder';
import { SeriesAuthors } from '@components/Series';
import { SeriesAccess, SeriesTitle } from '@pages/frontsite/components/Series';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';

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
              <LiteratureCover
                size="medium"
                url={_get(series, 'metadata.cover_metadata.urls.medium')}
              />
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
