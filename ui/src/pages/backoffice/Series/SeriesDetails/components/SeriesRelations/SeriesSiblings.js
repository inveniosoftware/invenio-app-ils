import { Error, Loader } from '@components';
import { RelationEdition } from '@pages/backoffice/components/Relations/RelationEdition';
import { RelationSequence } from '@pages/backoffice/Series/SeriesDetails/components/SeriesRelations/RelationSequence';
import { RelationLanguages } from './RelationLanguages';
import { RelationOther } from './RelationOther';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Tab } from 'semantic-ui-react';
import concat from 'lodash/concat';

export default class SeriesSiblings extends Component {
  render() {
    const { isLoading, error, seriesDetails } = this.props;

    const languages = this.props.relations['language'] || [];
    const editions = this.props.relations['edition'] || [];
    const other = this.props.relations['other'] || [];
    const sequence_next = this.props.relations['next'] || [];
    const sequence_previous = this.props.relations['previous'] || [];
    const sequence = concat(sequence_next, sequence_previous);

    const panes = [
      {
        menuItem: {
          key: 'languages',
          content: (
            <>
              Languages <Label>{languages.length}</Label>{' '}
            </>
          ),
        },
        render: () => (
          <Tab.Pane className="bo-relations-tab">
            <RelationLanguages />
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'editions',
          content: (
            <>
              Editions <Label>{editions.length}</Label>{' '}
            </>
          ),
        },
        render: () => (
          <Tab.Pane className="bo-relations-tab">
            <RelationEdition recordDetails={seriesDetails} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'sequences',
          content: (
            <>
              Sequences <Label>{sequence.length}</Label>{' '}
            </>
          ),
        },
        render: () => (
          <Tab.Pane className="bo-relations-tab">
            <RelationSequence recordDetails={seriesDetails} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'Other',
          content: (
            <>
              Other <Label>{other.length}</Label>{' '}
            </>
          ),
        },
        render: () => (
          <Tab.Pane className="bo-relations-tab">
            <RelationOther />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Tab id="series-siblings" panes={panes} />
        </Error>
      </Loader>
    );
  }
}

SeriesSiblings.propTypes = {
  relations: PropTypes.object.isRequired,
  seriesDetails: PropTypes.object.isRequired,
};
