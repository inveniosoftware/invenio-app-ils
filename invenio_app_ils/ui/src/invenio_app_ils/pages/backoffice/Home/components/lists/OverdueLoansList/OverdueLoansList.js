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
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../../components/buttons';

export default class OverdueLoansList extends Component {
  constructor(props) {
    super(props);
    this.fetchOverdueLoans = props.fetchOverdueLoans;
    this.showDetailsUrl = BackOfficeURLS.loanDetails;
    this.seeAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    this.fetchOverdueLoans();
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
            .overdue()
            .qs()
        )
      );

    return <SeeAllButton clickHandler={() => _click()} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      let serialized = formatter.loan.toTable(row);
      delete serialized['Request created'];
      serialized['Expiration date'] = row.request_expire_date;
      return serialized;
    });
  }

  _render_table(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Overdue loans'}
        subtitle={'Active loans with past due end date.'}
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

OverdueLoansList.propTypes = {
  fetchOverdueLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

OverdueLoansList.defaultProps = {
  showMaxEntries: 5,
};
