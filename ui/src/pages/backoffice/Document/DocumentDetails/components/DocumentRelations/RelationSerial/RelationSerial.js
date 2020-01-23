import { recordToPidType } from '@api/utils';
import { Error, Loader, Pagination, ResultsTable } from '@components';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice';
import { RelationSerialModal, RelationRemover } from '../../DocumentRelations';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

export default class RelationSerial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 0,
    };
  }

  onPageChange = page => {
    this.setState({ activePage: page });
  };

  viewDetails = ({ row }) => {
    return (
      <SeriesDetailsLink seriesPid={row.pid}>{row.title}</SeriesDetailsLink>
    );
  };

  removeHandler = ({ row }) => {
    const { documentDetails } = this.props;

    if (!isEmpty(documentDetails)) {
      return (
        <RelationRemover
          refererPid={documentDetails.metadata.pid}
          deletePayload={{
            parent_pid: row.pid,
            parent_pid_type: row.pid_type,
            child_pid: documentDetails.metadata.pid,
            child_pid_type: recordToPidType(documentDetails),
            relation_type: row.relation_type,
          }}
          buttonContent={'Remove from this serial'}
        />
      );
    }
  };

  render() {
    const activePage = this.state.activePage;
    const { relations, showMaxRows, isLoading, error } = this.props;
    const serial = relations['serial'] || [];

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      { title: 'Type', field: 'pid_type' },
      { title: 'Volume', field: 'volume' },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Tab.Pane>
            <RelationSerialModal relationType={'serial'} />

            <ResultsTable
              data={serial}
              columns={columns}
              totalHitsCount={serial.length}
              showMaxRows={showMaxRows}
              currentPage={activePage}
              renderEmptyResultsElement={() => (
                <InfoMessage
                  header={'No serials attached'}
                  content={
                    'Use the button above to attach this document to a serial.'
                  }
                />
              )}
              paginationComponent={
                <Pagination
                  currentPage={activePage}
                  currentSize={showMaxRows}
                  totalResults={serial.length}
                  onPageChange={this.onPageChange}
                />
              }
            />
          </Tab.Pane>
        </Error>
      </Loader>
    );
  }
}

RelationSerial.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  documentDetails: PropTypes.object.isRequired,
};
