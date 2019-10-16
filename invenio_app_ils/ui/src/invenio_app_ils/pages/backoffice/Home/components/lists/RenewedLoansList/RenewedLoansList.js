import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../../common/components';
import {} from '../../../../../../common/components';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { listQuery } from './state/listQuery';
import { SeeAllButton } from '../../../../components/buttons';
import pick from 'lodash/pick';

export default class RenewedLoansList extends Component {
  componentDidMount() {
    this.props.fetchRenewedLoans();
  }

  seeAllButton = () => {
    return (
      <SeeAllButton url={BackOfficeRoutes.loansListWithQuery(listQuery)} />
    );
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.loan.toTable(row), [
        'ID',
        'Patron ID',
        'State',
        'Item barcode',
        'End date',
        'Renewals',
      ]);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Frequently renewed loans'}
        subtitle={'Loans renewed more than 3 times - last 7 days.'}
        name={'frequently renewed loans'}
        rowActionClickHandler={BackOfficeRoutes.loanDetailsFor}
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

RenewedLoansList.propTypes = {
  fetchRenewedLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

RenewedLoansList.defaultProps = {
  showMaxEntries: 5,
};
