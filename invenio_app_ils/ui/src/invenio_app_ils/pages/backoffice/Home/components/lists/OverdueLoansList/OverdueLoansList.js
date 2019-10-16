import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../../common/components';
import { invenioConfig } from '../../../../../../common/config';
import { loan as loanApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { SeeAllButton } from '../../../../components/buttons';
import { OverdueLoanSendMailModal } from '../../../../components';
import pick from 'lodash/pick';

export default class OverdueLoansList extends Component {
  componentDidMount() {
    this.props.fetchOverdueLoans();
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .overdue()
        .withState(invenioConfig.circulation.loanActiveStates)
        .qs()
    );
    return <SeeAllButton url={path} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      const actions = <OverdueLoanSendMailModal loan={row} />;
      return pick(formatter.loan.toTable(row, actions), [
        'ID',
        'Patron ID',
        'Item barcode',
        'Expired',
        'Actions',
      ]);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Overdue loans'}
        subtitle={'Active loans that passed their end date.'}
        name={'overdue loans'}
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

OverdueLoansList.propTypes = {
  fetchOverdueLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

OverdueLoansList.defaultProps = {
  showMaxEntries: 5,
};
