import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { ResultsTable } from '../../../../../../common/components';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { listQuery } from './state/listQuery';
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../../components/buttons';
import { goTo, goToHandler } from '../../../../../../history';
import pick from 'lodash/pick';

export default class RenewedLoansList extends Component {
  constructor(props) {
    super(props);
    this.fetchRenewedLoans = props.fetchRenewedLoans;
    this.showDetailsUrl = BackOfficeRoutes.loanDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.loansListWithQuery;
  }

  componentDidMount() {
    this.fetchRenewedLoans();
  }

  seeAllButton = () => {
    return (
      <SeeAllButton clickHandler={goToHandler(this.seeAllUrl(listQuery))} />
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
        rowActionClickHandler={row => goTo(this.showDetailsUrl(row.ID))}
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
