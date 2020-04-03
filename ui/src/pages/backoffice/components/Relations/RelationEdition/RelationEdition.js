import { Error, Loader } from '@components';
import {
  DocumentDetailsLink,
  InfoMessage,
  SeriesDetailsLink,
} from '@pages/backoffice/components';
import {
  ExistingRelations,
  RelationRemover,
} from '@pages/backoffice/components/Relations';
import { DocumentTitle } from '@components/Document';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { RelationEditionModal } from '../RelationEdition';

export default class RelationEdition extends Component {
  constructor(props) {
    super(props);
    this.relationType = 'edition';
  }

  viewDetails = ({ row }) => {
    const titleCmp = <DocumentTitle metadata={row.record_fields} />;
    if (row.pid_type === 'docid')
      return (
        <DocumentDetailsLink pidValue={row.pid_value}>
          {titleCmp}
        </DocumentDetailsLink>
      );
    else if (row.pid_type === 'serid') {
      return (
        <SeriesDetailsLink pidValue={row.pid_value}>
          {titleCmp}
        </SeriesDetailsLink>
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
          relationType={row.relation_type}
          buttonContent={'Remove relation'}
        />
      );
    }
  };

  recTypeFormatter = ({ row }) => {
    if (row.pid_type === 'docid') {
      return row.record_fields.document_type;
    } else if (row.pid_type === 'serid') {
      return row.record_fields.mode_of_issuance;
    }
  };

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;
    const editions = relations[this.relationType] || [];

    const columns = [
      { title: 'PID', field: 'pid_value' },
      { title: 'Title', field: '', formatter: this.viewDetails },
      { title: 'Type', field: 'pid_type', formatter: this.recTypeFormatter },
      {
        title: 'Edition',
        field: 'record_fields.edition',
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationEditionModal
            relationType={this.relationType}
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
