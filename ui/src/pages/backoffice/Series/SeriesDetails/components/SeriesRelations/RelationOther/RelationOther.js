import { Error, Loader } from '@components';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice';
import { RelationOtherModal } from '../RelationOther';
import {
  RelationRemover,
  ExistingRelations,
} from '@pages/backoffice/components/Relations';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

export default class RelationOther extends Component {
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

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;
    const other = relations['other'] || [];

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      {
        title: 'Note',
        field: 'note',
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationOtherModal relationType={'other'} />

          <ExistingRelations
            rows={other}
            showMaxRows={showMaxRows}
            columns={columns}
            emptyMessage={
              <InfoMessage
                header={'No relations'}
                content={'Use the button above to add relations.'}
              />
            }
          />
        </Error>
      </Loader>
    );
  }
}

RelationOther.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  seriesDetails: PropTypes.object.isRequired,
};

RelationOther.defaultProps = {
  showMaxRows: 3,
};
