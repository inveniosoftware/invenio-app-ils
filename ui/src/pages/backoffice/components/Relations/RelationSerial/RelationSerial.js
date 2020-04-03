import { Error, Loader } from '@components';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice/components';
import {
  ExistingRelations,
  RelationRemover,
} from '@pages/backoffice/components/Relations';
import { DocumentTitle } from '@components/Document';
import { RelationSerialModal } from '../RelationSerial';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

export default class RelationSerial extends Component {
  constructor(props) {
    super(props);
    this.relationType = 'serial';
  }

  viewDetails = ({ row }) => {
    const titleCmp = <DocumentTitle metadata={row.record_fields} />;
    return (
      <SeriesDetailsLink pidValue={row.pid_value}>{titleCmp}</SeriesDetailsLink>
    );
  };

  removeHandler = ({ row }) => {
    const { recordDetails } = this.props;

    if (!isEmpty(recordDetails)) {
      return (
        <RelationRemover
          referrer={recordDetails}
          related={row}
          relationType={row.relation_type}
          buttonContent={'Remove from this serial'}
        />
      );
    }
  };

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;
    const serial = relations[this.relationType] || [];

    const columns = [
      { title: 'PID', field: 'pid_value' },
      { title: 'Title', field: '', formatter: this.viewDetails },
      { title: 'Volume', field: 'volume' },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationSerialModal
            relationType={this.relationType}
            recordDetails={this.props.recordDetails}
          />

          <ExistingRelations
            rows={serial}
            showMaxRows={showMaxRows}
            columns={columns}
            emptyMessage={
              <InfoMessage
                header={'No serials'}
                content={
                  'Use the button above to add this literature to a serial.'
                }
              />
            }
          />
        </Error>
      </Loader>
    );
  }
}

RelationSerial.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  recordDetails: PropTypes.object.isRequired,
};

RelationSerial.defaultProps = {
  showMaxRows: 3,
};
