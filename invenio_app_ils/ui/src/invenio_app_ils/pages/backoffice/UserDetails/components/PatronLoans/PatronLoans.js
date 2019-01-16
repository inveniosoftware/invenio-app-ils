import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { toString } from '../../../../../common/api/date';
import './PatronLoans.scss';

import { ResultsTable } from '../../../../../common/components';
import {
  showAllClickUrl,
  viewDetailsClickUrl,
} from '../../../../../common/urls';

export default class PatronLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronLoans = props.fetchPatronLoans;
    this.showDetailsUrl = viewDetailsClickUrl;
    this.showAllUrl = showAllClickUrl;
  }

  componentDidMount() {
    const patron_pid = this.props.patron ? this.props.patron : null;
    this.fetchPatronLoans(null, null, null, patron_pid);
  }

  _showDetailsHandler = loan_pid =>
    this.props.history.push(this.showDetailsUrl(loan_pid));

  _showAllHandler = patron_id =>
    this.props.history.push(this.showAllUrl(null, null, null, patron_id));

  _getFormattedDate = d => (d ? toString(d) : '');

  prepareData() {
    return this.props.data.map(row => ({
      ID: row.loan_pid,
      'Item PID': row.item_pid,
      State: row.state,
      Start_date: this._getFormattedDate(row.start_date),
      End_date: this._getFormattedDate(row.end_date),
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
            name={"User's loan requests"}
            detailsClickHandler={this._showDetailsHandler}
            showAllClickHandler={{
              handler: this._showAllHandler,
              params: this.props.patron,
            }}
            showMaxRows={this.props.showMaxLoans}
          />
        </Error>
      </Loader>
    );
  }
}

PatronLoans.propTypes = {
  patron: PropTypes.number,
  fetchPatronLoans: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronLoans.defaultProps = {
  showMaxLoans: 5,
};
