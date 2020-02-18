import { Error, Loader } from '@components';
import {
  DocumentDetailsLink,
  InfoMessage,
  SeriesDetailsLink,
} from '@pages/backoffice';
import { RelationEditionModal } from '../RelationEdition';
import {
  RelationRemover,
  ExistingRelations,
} from '@pages/backoffice/components/Relations';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

export default class RelationEdition extends Component {
  viewDetails = ({ row }) => {
    if (row.pid_type === 'docid')
      return (
        <DocumentDetailsLink documentPid={row.pid}>
          {row.title}
        </DocumentDetailsLink>
      );
    else if (row.pid_type === 'serid') {
      return (
        <SeriesDetailsLink seriesPid={row.pid}>{row.title}</SeriesDetailsLink>
      );
    }
  };

  removeHandler = ({ row }) => {
    const { recordDetails } = this.props;

    if (!isEmpty(recordDetails)) {
      return (
        <RelationRemover
          referrer={recordDetails}
          related={row}
          buttonContent={'Remove relation'}
        />
      );
    }
  };

  recTypeFormatter = ({ row }) => {
    if (row.pid_type === 'docid') {
      return row.document_type;
    } else if (row.pid_type === 'serid') {
      return row.mode_of_issuance;
    }
  };

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;
    const editions = relations['edition'] || [];

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      { title: 'Type', field: 'pid_type', formatter: this.recTypeFormatter },
      {
        title: 'Edition',
        field: 'edition',
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationEditionModal
            relationType={'edition'}
            recordDetails={this.props.recordDetails}
          />

          <ExistingRelations
            rows={editions}
            showMaxRows={showMaxRows}
            columns={columns}
            emptyMessage={
              <InfoMessage
                header={'No related editions'}
                content={'Use the button above to add related edition.'}
              />
            }
          />
        </Error>
      </Loader>
    );
  }
}

RelationEdition.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  recordDetails: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number.isRequired,
};

RelationEdition.defaultProps = {
  showMaxRows: 3,
};
