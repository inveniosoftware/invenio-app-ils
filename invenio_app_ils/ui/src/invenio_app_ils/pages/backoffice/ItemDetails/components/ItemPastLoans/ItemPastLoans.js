import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api/';
import { ResultsTable } from '../../../../../common/components';

import {
  loanSearchQueryUrl,
  viewLoanDetailsUrl,
} from '../../../../../common/urls';
import { Button } from 'semantic-ui-react';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';

export default class ItemPastLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPastLoans = props.fetchPastLoans;
    this.showDetailsUrl = viewLoanDetailsUrl;
    this.showAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    const { item_pid } = this.props.item;
    this.fetchPastLoans(item_pid);
  }

  _showDetailsHandler = loan_pid =>
    this.props.history.push(this.showDetailsUrl(loan_pid));

  _showAllButton = () => {
    const { item_pid } = this.props.item;
    const _click = () =>
      this.props.history.push(
        this.showAllUrl(
          loanApi
            .query()
            .withItemPid(item_pid)
            .withState(['ITEM_RETURNED', 'CANCELLED'])
            .qs()
        )
      );

    return (
      <Button
        size="small"
        onClick={() => {
          _click();
        }}
      >
        Show all
      </Button>
    );
  };

  prepareData() {
    return this.props.data.map(row => formatter.loan.toTable(row));
  }

  render() {
    const rows = this.prepareData();
    const { data, isLoading, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <ResultsTable
            rows={rows}
            name={'Loans history'}
            actionClickHandler={this._showDetailsHandler}
            showAllButton={this._showAllButton()}
            showMaxRows={this.props.showMaxPastLoans}
          />
        </Error>
      </Loader>
    );
  }
}

ItemPastLoans.propTypes = {
  item: PropTypes.object.isRequired,
  fetchPastLoans: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  showMaxPastLoans: PropTypes.number,
};

ItemPastLoans.defaultProps = {
  showMaxPastLoans: 5,
};
