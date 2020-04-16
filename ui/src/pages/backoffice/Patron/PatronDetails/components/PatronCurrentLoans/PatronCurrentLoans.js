import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Loader, Error, ResultsTable } from '@components';
import { loan as loanApi } from '@api';
import { invenioConfig } from '@config';
import { BackOfficeRoutes } from '@routes/urls';
import { dateFormatter } from '@api/date';
import { SeeAllButton } from '@pages/backoffice/components/buttons';

export default class PatronCurrentLoans extends Component {
  componentDidMount() {
    const patronPid = this.props.patronDetails.user_pid
      ? this.props.patronDetails.user_pid
      : null;
    this.props.fetchPatronCurrentLoans(patronPid);
  }

  seeAllButton = () => {
    const patronPid = this.props.patronDetails.user_pid;
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withPatronPid(patronPid)
        .withState(invenioConfig.circulation.loanActiveStates)
        .sortByNewest()
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

  render() {
    const { data, isLoading, error } = this.props;
    const columns = [
      { title: 'PID', formatter: this.viewDetails },
      { title: 'Item barcode', field: 'metadata.item.barcode' },
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
      { title: 'Renewals', field: 'metadata.extension_count' },
    ];
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            data={data.hits}
            columns={columns}
            totalHitsCount={data.total}
            name={'current loans'}
            seeAllComponent={this.seeAllButton()}
            showMaxRows={this.props.showMaxLoans}
          />
        </Error>
      </Loader>
    );
  }
}

PatronCurrentLoans.propTypes = {
  patronDetails: PropTypes.object,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronCurrentLoans.defaultProps = {
  showMaxLoans: 5,
};
