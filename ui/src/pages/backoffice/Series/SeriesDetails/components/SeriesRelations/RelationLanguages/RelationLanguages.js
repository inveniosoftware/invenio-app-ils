import { Error, Loader } from '@components';
import { SeriesLanguages } from '@components/Series';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice';
import { RelationLanguagesModal } from '../RelationLanguages';
import {
  RelationRemover,
  ExistingRelations,
} from '@pages/backoffice/components/Relations';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

export default class RelationLanguage extends Component {
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
    const languages = relations['language'] || [];

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      {
        title: 'Language(s)',
        field: 'languages',
        formatter: this.languagesFormatter,
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationLanguagesModal relationType={'language'} />

          <ExistingRelations
            rows={languages}
            showMaxRows={showMaxRows}
            columns={columns}
            emptyMessage={
              <InfoMessage
                header={'No related languages'}
                content={'Use the button above to add related languages.'}
              />
            }
          />
        </Error>
      </Loader>
    );
  }
}

RelationLanguage.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  seriesDetails: PropTypes.object.isRequired,
};

RelationLanguage.defaultProps = {
  showMaxRows: 3,
};
