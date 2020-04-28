import { loan as loanApi } from '@api';
import { dateFormatter } from '@api/date';
import { Error, Loader, ResultsTable } from '@components';
import { DocumentTitle } from '@components/Document';
import { invenioConfig } from '@config';
import {
  DocumentDetailsLink,
  SeeAllButton,
} from '@pages/backoffice/components/buttons';
import {
  ItemDetailsLink,
  LoanDetailsLink,
} from '@pages/backoffice/components/buttons/ViewDetailsButtons';
import { BackOfficeRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class PatronPastLoans extends Component {
  componentDidMount() {
    const patronPid = this.props.patronDetails.user_pid;
    this.props.fetchPatronPastLoans(patronPid);
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
      <LoanDetailsLink loanPid={row.metadata.pid}>
        {row.metadata.pid}
      </LoanDetailsLink>
    );
  };

  viewDocument = ({ row }) => {
    return (
      <DocumentDetailsLink pidValue={row.pid}>
        <DocumentTitle metadata={row.metadata.document} />
      </DocumentDetailsLink>
    );
  };

  viewItem = ({ row }) => {
    return (
      <ItemDetailsLink itemPid={row.metadata.pid}>
        {row.metadata.item.barcode}
      </ItemDetailsLink>
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
        title: 'Physical copy',
        formatter: this.viewItem,
      },
      {
        title: 'State',
        field: 'metadata.state',
      },
      {
        title: 'Start date',
        field: 'metadata.start_date',
        formatter: dateFormatter,
      },
      {
        title: 'End date',
        field: 'metadata.end_date',
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

PatronPastLoans.propTypes = {
  patronDetails: PropTypes.object,
  fetchPatronPastLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronPastLoans.defaultProps = {
  showMaxLoans: 5,
};
