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
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../../components/buttons';
import { pick } from 'lodash/object';

export default class RenewedLoansList extends Component {
  constructor(props) {
    super(props);
    this.fetchRenewedLoans = props.fetchRenewedLoans;
    this.showDetailsUrl = BackOfficeURLS.loanDetails;
    this.seeAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    this.fetchRenewedLoans();
  }

  _showDetailsHandler = loan_pid =>
    this.props.history.push(
      generatePath(this.showDetailsUrl, { loanPid: loan_pid })
    );

  _seeAllButton = () => {
    const _click = () => {
      this.props.history.push(this.seeAllUrl(listQuery));
    };

    return <SeeAllButton clickHandler={() => _click()} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.loan.toTable(row), [
        'ID',
        'Patron ID',
        'State',
        'Item barcode',
        'End date',
        'Renewals',
      ]);
    });
  }

  _render_table(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Frequently renewed loans'}
        subtitle={'Loans renewed more than 3 times - last 7 days.'}
        name={'frequently renewed loans'}
        rowActionClickHandler={this._showDetailsHandler}
        seeAllComponent={this._seeAllButton()}
        showMaxRows={this.props.showMaxEntries}
      />
    );
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this._render_table(data)}</Error>
      </Loader>
    );
  }
}

RenewedLoansList.propTypes = {
  fetchRenewedLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

RenewedLoansList.defaultProps = {
  showMaxEntries: 5,
};
