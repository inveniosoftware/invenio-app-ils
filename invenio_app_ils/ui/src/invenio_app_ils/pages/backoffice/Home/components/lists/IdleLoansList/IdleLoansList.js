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
import { toShortDateTime } from '../../../../../../common/api/date';
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../../components/buttons';

export default class IdleLoansList extends Component {
  constructor(props) {
    super(props);
    this.fetchIdlePendingLoans = props.fetchIdlePendingLoans;
    this.showDetailsUrl = BackOfficeURLS.loanDetails;
    this.seeAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    this.fetchIdlePendingLoans();
  }

  _showDetailsHandler = loan_pid =>
    this.props.history.push(
      generatePath(this.showDetailsUrl, { loanPid: loan_pid })
    );

  _seeAllButton = () => {
    const _click = () =>
      this.props.history.push(
        this.seeAllUrl(
          loanApi
            .query()
            .withState('PENDING')
            .withUpdated({ to: DateTime.local().minus({ days: 10 }) })
            .qs()
        )
      );

    return <SeeAllButton clickHandler={() => _click()} />;
  };

  prepareData() {
    return this.props.data.hits.map(row => {
      let serialized = formatter.loan.toTable(row);
      delete serialized['Request created'];
      serialized['Last update'] = toShortDateTime(row.updated);
      return serialized;
    });
  }

  _render_table() {
    const rows = this.prepareData();
    rows.totalHits = this.props.data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Idle loans'}
        subtitle={'Loan requests in PENDING state longer than 10 days.'}
        rowActionClickHandler={this._showDetailsHandler}
        seeAllComponent={this._seeAllButton()}
        showMaxRows={this.props.showMaxEntries}
      />
    );
  }

  render() {
    const { data, isLoading, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          {isLoading ? null : this._render_table()}
        </Error>
      </Loader>
    );
  }
}

IdleLoansList.propTypes = {
  fetchIdlePendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

IdleLoansList.defaultProps = {
  showMaxEntries: 5,
};
