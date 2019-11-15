import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import {
  Loader,
  Error,
  ResultsTable,
} from '@components';
import { invenioConfig } from '@config';
import { loan as loanApi } from '@api';
import { BackOfficeRoutes } from '@routes/urls';
import { DateTime } from 'luxon';
import { SeeAllButton } from '@pages/backoffice/components/buttons';
import { dateFormatter, toShortDate } from '@api/date';

export default class IdleLoansList extends Component {
  componentDidMount() {
    this.props.fetchIdlePendingLoans();
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withState(invenioConfig.circulation.loanRequestStates)
        .withUpdated({ to: toShortDate(DateTime.local().minus({ days: 10 })) })
        .qs()
    );
    return <SeeAllButton to={path} />;
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.loanDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderTable(data) {
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Patron ID', field: 'metadata.patron_pid' },
      { title: 'Document ID', field: 'metadata.document_pid' },
      {
        title: 'Request start date',
        field: 'metadata.request_start_date',
        formatter: dateFormatter,
      },
    ];
    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCounts={data.total}
        title={'Idle loan requests'}
        subtitle={'Loan requests pending since more than 10 days.'}
        name={'idle loan requests'}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxEntries}
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

IdleLoansList.propTypes = {
  fetchIdlePendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

IdleLoansList.defaultProps = {
  showMaxEntries: 5,
};
