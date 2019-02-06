import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { generatePath } from 'react-router';
import { Loader, Error } from '../../../../../../common/components';
import { ResultsTable } from '../../../../../../common/components';
import { loan as loanApi } from '../../../../../../common/api';

import {
  BackOfficeURLS,
  loanSearchQueryUrl,
} from '../../../../../../common/urls';
import { DateTime } from 'luxon';

export default class IdleLoansList extends Component {
  constructor(props) {
    super(props);
    this.fetchIdlePendingLoans = props.fetchIdlePendingLoans;
    this.showDetailsUrl = BackOfficeURLS.loanDetails;
    this.showAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    this.fetchIdlePendingLoans();
  }

  _showDetailsHandler = loan_pid =>
    this.props.history.push(
      generatePath(this.showDetailsUrl, { documentPid: loan_pid })
    );

  _showAllHandler = params => {
    this.props.history.push(
      this.showAllUrl(
        loanApi
          .query()
          .withState('PENDING')
          .withUpdated({ to: DateTime.local().minus({ days: 10 }) })
          .qs()
      )
    );
  };

  prepareData() {
    return this.props.data.map(row => {
      let serialized = loanApi.serializer.toTableView(row);
      delete serialized['Request created'];
      serialized['Last update'] = row.updated;
      return serialized;
    });
  }

  _render_table() {
    const rows = this.prepareData();
    return (
      <ResultsTable
        rows={rows}
        name={'Idle loans'}
        actionClickHandler={this._showDetailsHandler}
        showAllClickHandler={{
          handler: this._showAllHandler,
          params: null,
        }}
        showMaxRows={this.props.showMaxEntries}
      />
    );
  }

  render() {
    const { data, isLoading, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>{this._render_table()}</Error>
      </Loader>
    );
  }
}

IdleLoansList.propTypes = {
  fetchIdlePendingLoans: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  showMaxEntries: PropTypes.number,
};

IdleLoansList.defaultProps = {
  showMaxEntries: 5,
};
