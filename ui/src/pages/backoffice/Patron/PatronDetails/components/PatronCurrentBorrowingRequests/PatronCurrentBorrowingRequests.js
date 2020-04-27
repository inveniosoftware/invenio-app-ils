import { dateFormatter } from '@api/date';
import { DocumentTitle } from '@components/Document';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Loader, Error, ResultsTable } from '@components';
import { illBorrowingRequest as borrowingRequestApi } from '@api';
import { invenioConfig } from '@config';
import { ILLRoutes, BackOfficeRoutes } from '@routes/urls';
import { SeeAllButton } from '@pages/backoffice/components/buttons';
import _difference from 'lodash/difference';

export default class PatronCurrentBorrowingRequests extends Component {
  componentDidMount() {
    const patronPid = this.props.patronDetails.user_pid
      ? this.props.patronDetails.user_pid
      : null;
    this.props.fetchPatronCurrentBorrowingRequests(patronPid);
  }

  seeAllButton = () => {
    const illConfig = invenioConfig.illBorrowingRequests;
    const statuses = _difference(
      illConfig.orderedValidStatuses,
      illConfig.completedStatuses
    );
    const patronPid = this.props.patronDetails.user_pid;
    const path = ILLRoutes.borrowingRequestListWithQuery(
      borrowingRequestApi
        .query()
        .withPatron(patronPid)
        .withState(statuses)
        .qs()
    );
    return <SeeAllButton to={path} />;
  };

  viewDetails = ({ row }) => {
    return (
      <Link
        to={ILLRoutes.borrowingRequestDetailsFor(row.metadata.pid)}
        data-test={row.metadata.pid}
      >
        {row.metadata.pid}
      </Link>
    );
  };

  viewDocument = ({ row }) => {
    return (
      <Link
        to={BackOfficeRoutes.documentDetailsFor(row.metadata.document_pid)}
        data-test={row.metadata.pid}
      >
        <DocumentTitle metadata={row.metadata.document} />
      </Link>
    );
  };

  viewLibrary = ({ row }) => {
    return (
      <Link
        to={ILLRoutes.libraryDetailsFor(row.metadata.library_pid)}
        data-test={row.metadata.pid}
      >
        {row.metadata.library.name}
      </Link>
    );
  };

  viewDate = date => {
    return <> {dateFormatter({ ...date }, '-')} </>;
  };

  renderTable(data) {
    const columns = [
      {
        title: 'PID',
        formatter: this.viewDetails,
      },
      {
        title: 'Document',
        formatter: this.viewDocument,
      },
      {
        title: 'Library',
        formatter: this.viewLibrary,
      },
      {
        title: 'Created on',
        field: 'created',
        formatter: dateFormatter,
      },
      {
        title: 'State',
        field: 'metadata.status',
      },
      {
        title: 'Requested on',
        field: 'metadata.request_date',
        formatter: this.viewDate,
      },
      {
        title: 'Expected delivery',
        field: 'metadata.expected_delivery_date',
        formatter: this.viewDate,
      },
      {
        title: 'Received on',
        field: 'metadata.received_date',
        formatter: this.viewDate,
      },
    ];

    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCount={data.total}
        name={'borrowing requests'}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxRequests}
      />
    );
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderTable(data)}</Error>
      </Loader>
    );
  }
}

PatronCurrentBorrowingRequests.propTypes = {
  showMaxRequests: PropTypes.number,
  // from redux
  patronDetails: PropTypes.object,
  fetchPatronCurrentBorrowingRequests: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

PatronCurrentBorrowingRequests.defaultProps = {
  showMaxRequests: 5,
};
