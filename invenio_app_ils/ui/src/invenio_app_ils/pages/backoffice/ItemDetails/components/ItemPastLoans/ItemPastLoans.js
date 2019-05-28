import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api/';
import { ResultsTable } from '../../../../../common/components';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../components/buttons';
import pick from 'lodash/pick';

export default class ItemPastLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPastLoans = props.fetchPastLoans;
    this.showDetailsUrl = BackOfficeRoutes.loanDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.loansListWithQuery;
  }

  componentDidMount() {
    const { item_pid } = this.props.item;
    this.fetchPastLoans(item_pid);
  }

  showDetailsHandler = loanPid =>
    this.props.history.push(this.showDetailsUrl(loanPid));

  seeAllButton = () => {
    const { item_pid } = this.props.item;
    const click = () =>
      this.props.history.push(
        this.seeAllUrl(
          loanApi
            .query()
            .withItemPid(item_pid)
            .withState(['ITEM_RETURNED', 'CANCELLED'])
            .qs()
        )
      );
    return <SeeAllButton clickHandler={() => click()} />;
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
        rowActionClickHandler={this.showDetailsHandler}
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
  item: PropTypes.object.isRequired,
  fetchPastLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxPastLoans: PropTypes.number,
};

ItemPastLoans.defaultProps = {
  showMaxPastLoans: 5,
};
