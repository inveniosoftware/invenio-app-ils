import { Error, Loader } from '@components';
import { DocumentDetailsLink, InfoMessage } from '@pages/backoffice/components';
import {
  ExistingRelations,
  RelationRemover,
} from '@pages/backoffice/components/Relations';
import { DocumentTitle } from '@components/Document';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { RelationOtherModal } from '../RelationOther';

export default class RelationOther extends Component {
  constructor(props) {
    super(props);
    this.relationType = 'other';
  }

  viewDetails = ({ row }) => {
    return (
      <DocumentDetailsLink pidValue={row.pid_value}>
        <DocumentTitle metadata={row.record_metadata} />
      </DocumentDetailsLink>
    );
  };

  removeHandler = ({ row }) => {
    const { documentDetails } = this.props;

    if (!isEmpty(documentDetails)) {
      return (
        <RelationRemover
          referrer={documentDetails}
          related={row}
          relationType={row.relation_type}
          buttonContent={'Remove relation'}
        />
      );
    }
  };

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;
    const other = relations[this.relationType] || [];

    const columns = [
      { title: 'PID', field: 'pid_value' },
      { title: 'Title', field: '', formatter: this.viewDetails },
      {
        title: 'Note',
        field: 'note',
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationOtherModal relationType={this.relationType} />

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
  documentDetails: PropTypes.object.isRequired,
};

RelationOther.defaultProps = {
  showMaxRows: 3,
};
