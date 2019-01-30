import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { toString } from '../../../../../common/api/date';
import { loan as loanApi } from '../../../../../common/api/';
import { ResultsTable } from '../../../../../common/components';

import {
  loanSearchQueryUrl,
  viewLoanDetailsUrl,
} from '../../../../../common/urls';

export default class ItemPastLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPastLoans = props.fetchPastLoans;
    this.showDetailsUrl = viewLoanDetailsUrl;
    this.showAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    const { document_pid, item_pid } = this.props.item.metadata;
    this.fetchPastLoans(document_pid, item_pid);
  }

  _getFormattedDate = d => (d ? toString(d) : '');

  _showDetailsHandler = loan_pid =>
    this.props.history.push(this.showDetailsUrl(loan_pid));

  _showAllHandler = params => {
    const { document_pid, item_pid } = this.props.item.metadata;
    this.props.history.push(
      this.showAllUrl(
        loanApi
          .query()
          .withDocPid(document_pid)
          .withItemPid(item_pid)
          .withState(['ITEM_RETURNED', 'CANCELLED'])
          .qs()
      )
    );
  };

  prepareData() {
    return this.props.data.map(row => ({
      ID: row.loan_pid,
      'Patron PID': row.patron_pid,
      'Request created': this._getFormattedDate(row.updated),
      State: row.state,
    }));
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
            showAllClickHandler={{
              handler: this._showAllHandler,
              params: null,
            }}
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
