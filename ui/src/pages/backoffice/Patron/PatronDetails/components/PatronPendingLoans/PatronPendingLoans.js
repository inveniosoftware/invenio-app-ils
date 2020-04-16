import { dateFormatter } from '@api/date';
import { DocumentTitle } from '@components/Document';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Loader, Error, ResultsTable } from '@components';
import { loan as loanApi } from '@api';
import { invenioConfig } from '@config';
import { BackOfficeRoutes } from '@routes/urls';
import { SeeAllButton } from '@pages/backoffice/components/buttons';

export default class PatronPendingLoans extends Component {
  componentDidMount() {
    const patronPid = this.props.patronDetails.user_pid
      ? this.props.patronDetails.user_pid
      : null;
    this.props.fetchPatronPendingLoans(patronPid);
  }

  seeAllButton = () => {
    const patronPid = this.props.patronDetails.user_pid;
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withPatronPid(patronPid)
        .withState(invenioConfig.circulation.loanRequestStates)
        .qs()
    );
    return <SeeAllButton to={path} />;
  };

  viewDetails = ({ row }) => {
    return (
      <Link
        to={BackOfficeRoutes.loanDetailsFor(row.metadata.pid)}
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

  renderTable(data) {
    const columns = [
      {
        title: 'Loan request PID',
        formatter: this.viewDetails,
      },
      {
        title: 'Document',
        formatter: this.viewDocument,
      },
      {
        title: 'Request interest from',
        field: 'metadata.request_start_date',
        formatter: dateFormatter,
      },
      {
        title: 'Request expires on',
        field: 'metadata.request_expire_date',
        formatter: dateFormatter,
      },
    ];

    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCount={data.total}
        name={'loan requests'}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxLoans}
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

PatronPendingLoans.propTypes = {
  patronDetails: PropTypes.object,
  fetchPatronPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronPendingLoans.defaultProps = {
  showMaxLoans: 5,
};
