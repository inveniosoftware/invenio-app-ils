import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api';
import { invenioConfig } from '../../../../../common/config';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { SeeAllButton } from '../../../components/buttons';
import pick from 'lodash/pick';

export default class ItemPastLoans extends Component {
  componentDidMount() {
    const { pid } = this.props.itemDetails;
    this.props.fetchPastLoans(pid);
  }

  seeAllButton = () => {
    const { pid } = this.props.itemDetails;
    const loanStates = invenioConfig.circulation.loanCompletedStates.concat(
      invenioConfig.circulation.loanCancelledStates
    );
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withItemPid(pid)
        .withState(loanStates)
        .qs()
    );
    return <SeeAllButton url={path} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.loan.toTable(row), [
        'ID',
        'Updated',
        'Patron ID',
        'Document ID',
        'State',
        'Start date',
        'End date',
        'Transaction date',
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
        title={'Loans history'}
        name={'loans'}
        rowActionClickHandler={BackOfficeRoutes.loanDetailsFor}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxPastLoans}
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

ItemPastLoans.propTypes = {
  itemDetails: PropTypes.object.isRequired,
  fetchPastLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxPastLoans: PropTypes.number,
};

ItemPastLoans.defaultProps = {
  showMaxPastLoans: 5,
};
