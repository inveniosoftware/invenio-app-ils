import { Error, Loader } from '@components';
import { SeriesLanguages } from '@components/Series';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice/components';
import {
  ExistingRelations,
  RelationRemover,
} from '@pages/backoffice/components/Relations';
import { DocumentTitle } from '@components/Document';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { RelationLanguagesModal } from '../RelationLanguages';

export default class RelationLanguage extends Component {
  constructor(props) {
    super(props);
    this.relationType = 'language';
  }

  viewDetails = ({ row }) => {
    const titleCmp = <DocumentTitle metadata={row.record_fields} />;
    return (
      <SeriesDetailsLink pidValue={row.pid_value}>{titleCmp}</SeriesDetailsLink>
    );
  };

  removeHandler = ({ row }) => {
    const { seriesDetails } = this.props;

    if (!isEmpty(seriesDetails)) {
      return (
        <RelationRemover
          referrer={seriesDetails}
          related={row}
          relationType={row.relation_type}
          buttonContent={'Remove relation'}
        />
      );
    }
  };

  languagesFormatter = ({ row }) => {
    return <SeriesLanguages metadata={row.record_fields} />;
  };

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;
    const languages = relations[this.relationType] || [];

    const columns = [
      { title: 'PID', field: 'pid_value' },
      { title: 'Title', field: '', formatter: this.viewDetails },
      {
        title: 'Language(s)',
        field: '',
        formatter: this.languagesFormatter,
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationLanguagesModal relationType={this.relationType} />

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
