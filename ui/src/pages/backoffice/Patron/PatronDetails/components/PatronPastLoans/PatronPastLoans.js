import { dateFormatter } from '@api/date';
import { DocumentTitle } from '@components/Document';
import {
  ItemDetailsLink,
  LoanDetailsLink,
} from '@pages/backoffice/components/buttons/ViewDetailsButtons';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error, ResultsTable } from '@components';
import { loan as loanApi } from '@api';
import { invenioConfig } from '@config';
import { BackOfficeRoutes } from '@routes/urls';
import {
  DocumentDetailsLink,
  SeeAllButton,
} from '@pages/backoffice/components/buttons';
import _get from 'lodash/get';

export default class PatronPastLoans extends Component {
  componentDidMount() {
    const patronPid = _get(this.props, 'patronDetails.user_pid', null);
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
      <DocumentDetailsLink documentPid={row.pid}>
        <DocumentTitle document={row.metadata.document} />
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
