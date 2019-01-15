import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { toString } from '../../../../../common/api/date';
import { ResultsTable } from '../../../../../common/components';

import {
  showAllLoansUrl,
  viewLoanDetailsUrl,
} from '../../../../../common/urls';

export default class ItemPastLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPastLoans = props.fetchPastLoans;
    this.showDetailsUrl = viewLoanDetailsUrl;
    this.showAllUrl = showAllLoansUrl;
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
        document_pid,
        item_pid,
        'ITEM_RETURNED',
        null,
        'OR state:CANCELLED'
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
            detailsClickHandler={this._showDetailsHandler}
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
