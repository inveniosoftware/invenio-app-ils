import { Error, Loader } from '@components';
import { SeriesLanguages } from '@components/Series';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice/components';
import {
  ExistingRelations,
  RelationRemover,
} from '@pages/backoffice/components/Relations';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Divider, Grid } from 'semantic-ui-react';
import { RelationSequenceModal } from '../RelationSequence';

export default class RelationSequence extends Component {
  viewDetails = ({ row }) => {
    return (
      <SeriesDetailsLink seriesPid={row.pid}>{row.title}</SeriesDetailsLink>
    );
  };

  removeHandler = ({ row }) => {
    const { seriesDetails } = this.props;

    if (!isEmpty(seriesDetails)) {
      return (
        <RelationRemover
          referrer={seriesDetails}
          related={row}
          buttonContent={'Remove relation'}
        />
      );
    }
  };

  languagesFormatter = ({ row }) => {
    return <SeriesLanguages metadata={row} />;
  };

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;
    const next = relations['next'] || [];
    const previous = relations['previous'] || [];

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      {
        title: 'Languages',
        field: 'languages',
        formatter: this.languagesFormatter,
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationSequenceModal relationType={'sequence'} />
          <Grid columns={2} relaxed="very">
            <Grid.Column width={8}>
              <Divider horizontal> Predecessors of this serial </Divider>
              <ExistingRelations
                rows={previous}
                showMaxRows={showMaxRows}
                columns={columns}
                emptyMessage={
                  <InfoMessage
                    header={'No predecessors'}
                    content={'Use the button above to sequence relations.'}
                  />
                }
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Divider horizontal> Continuations of this serial </Divider>
              <ExistingRelations
                rows={next}
                showMaxRows={showMaxRows}
                columns={columns}
                emptyMessage={
                  <InfoMessage
                    header={'No continuations'}
                    content={
                      'Use the button above to create a sequential relation.'
                    }
                  />
                }
              />
            </Grid.Column>
          </Grid>
        </Error>
      </Loader>
    );
  }
}

RelationSequence.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  seriesDetails: PropTypes.object.isRequired,
};

RelationSequence.defaultProps = {
  showMaxRows: 3,
};
