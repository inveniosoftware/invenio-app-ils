import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { generatePath } from 'react-router';
import { Loader, Error } from '../../../../../../common/components';
import { ResultsTable } from '../../../../../../common/components';

import {
  BackOfficeURLS,
  loanSearchQueryUrl,
} from '../../../../../../common/urls';
import { listQuery } from './state/listQuery';
import { toShortDate } from '../../../../../../common/api/date';
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import { Button } from 'semantic-ui-react';

export default class RenewedLoansList extends Component {
  constructor(props) {
    super(props);
    this.fetchRenewedLoans = props.fetchRenewedLoans;
    this.showDetailsUrl = BackOfficeURLS.loanDetails;
    this.showAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    this.fetchRenewedLoans();
  }

  _showDetailsHandler = loan_pid =>
    this.props.history.push(
      generatePath(this.showDetailsUrl, { loanPid: loan_pid })
    );

  _showAllButton = () => {
    const _click = () => {
      this.props.history.push(this.showAllUrl(listQuery));
    };

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
    return this.props.data.map(row => {
      let serialized = formatter.loan.toTable(row);
      delete serialized['Request created'];
      serialized['Last update'] = toShortDate(row.updated);
      serialized['Renewals'] = row.extension_count;
      return serialized;
    });
  }

  _render_table() {
    const rows = this.prepareData();
    return (
      <ResultsTable
        rows={rows}
        name={'Frequently renewed loans'}
        actionClickHandler={this._showDetailsHandler}
        showAllButton={this._showAllButton()}
        showMaxRows={this.props.showMaxEntries}
        popup={'Loans renewed more than 3 times - last 7 days'}
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

RenewedLoansList.propTypes = {
  fetchRenewedLoans: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  showMaxEntries: PropTypes.number,
};

RenewedLoansList.defaultProps = {
  showMaxEntries: 5,
};
