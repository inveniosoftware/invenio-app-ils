import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { toString } from '../../../../../common/api/date';
import { ResultsTable } from '../../../../../common/components';

import './ItemPendingLoans.scss';
import {
  showAllLoansUrl,
  viewLoanDetailsUrl,
} from '../../../../../common/urls';

export default class ItemPendingLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPendingLoans = props.fetchPendingLoans;
    this.showDetailsUrl = viewLoanDetailsUrl;
    this.showAllUrl = showAllLoansUrl;
  }

  componentDidMount() {
    const { document_pid, item_pid } = this.props.item.metadata;
    this.fetchPendingLoans(document_pid, item_pid);
  }

  _getFormattedDate = d => (d ? toString(d) : '');

  _showDetailsHandler = loan_pid =>
    this.props.history.push(this.showDetailsUrl(loan_pid));

  _showAllHandler = () => {
    const { document_pid, item_pid } = this.props.item.metadata;
    this.props.history.push(
      this.showAllUrl(document_pid, item_pid, 'PENDING', null)
    );
  };

  prepareData() {
    return this.props.data.map(row => ({
      ID: row.loan_pid,
      'Patron PID': row.patron_pid,
      'Request created': this._getFormattedDate(row.updated),
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
            name={'Pending loans requests'}
            detailsClickHandler={this._showDetailsHandler}
            showAllClickHandler={{
              handler: this._showAllHandler,
              params: null,
            }}
            showMaxRows={this.props.showMaxPendingLoans}
          />
        </Error>
      </Loader>
    );
  }
}

ItemPendingLoans.propTypes = {
  item: PropTypes.object.isRequired,
  fetchPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  showMaxPendingLoans: PropTypes.number,
};

ItemPendingLoans.defaultProps = {
  showMaxPendingLoans: 5,
};
