import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api/';
import './PatronLoans.scss';

import { ResultsTable } from '../../../../../common/components';
import {
  loanSearchQueryUrl,
  viewLoanDetailsUrl,
} from '../../../../../common/urls';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../components/buttons';

export default class PatronLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronLoans = props.fetchPatronLoans;
    this.showDetailsUrl = viewLoanDetailsUrl;
    this.seeAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    const patron_pid = this.props.patron ? this.props.patron : null;
    this.fetchPatronLoans(patron_pid);
  }

  _showDetailsHandler = loan_pid =>
    this.props.history.push(this.showDetailsUrl(loan_pid));

  _seeAllButton = () => {
    const { patron } = this.props;
    const _click = () =>
      this.props.history.push(
        this.seeAllUrl(
          loanApi
            .query()
            .withPatronPid(patron)
            .qs()
        )
      );
    return <SeeAllButton clickHandler={() => _click()} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      let tableRow = formatter.loan.toTable(row);
      delete tableRow['Patron ID'];
      return tableRow;
    });
  }

  _render_table(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={"User's loan requests"}
        rowActionClickHandler={this._showDetailsHandler}
        seeAllComponent={this._seeAllButton()}
        showMaxRows={this.props.showMaxLoans}
      />
    );
  }

  render() {
    const { data, isLoading, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>{this._render_table(data)}</Error>
      </Loader>
    );
  }
}

PatronLoans.propTypes = {
  patron: PropTypes.number,
  fetchPatronLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronLoans.defaultProps = {
  showMaxLoans: 5,
};
