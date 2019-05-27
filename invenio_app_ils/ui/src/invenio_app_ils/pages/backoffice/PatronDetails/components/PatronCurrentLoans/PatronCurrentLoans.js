import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api/';

import { ResultsTable } from '../../../../../common/components';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../components/buttons';

import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

export default class PatronCurrentLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronCurrentLoans = props.fetchPatronCurrentLoans;
    this.showDetailsUrl = BackOfficeRoutes.loanDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.loansListWithQuery;
  }

  componentDidMount() {
    const patron_pid = this.props.patron ? this.props.patron : null;
    this.fetchPatronCurrentLoans(patron_pid);
  }

  showDetailsHandler = loan_pid =>
    this.props.history.push(this.showDetailsUrl(loan_pid));

  seeAllButton = () => {
    const { patron } = this.props;
    const click = () =>
      this.props.history.push(
        this.seeAllUrl(
          loanApi
            .query()
            .withPatronPid(patron)
            .withState('ITEM_ON_LOAN')
            .sortByNewest()
            .qs()
        )
      );
    return <SeeAllButton clickHandler={() => click()} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.loan.toTable(row), [
        'ID',
        'Item barcode',
        'Start date',
        'End date',
        'Renewals',
      ]);
    });
  }

  render() {
    const { data, isLoading, hasError, error } = this.props;
    const rows =
      !hasError && !isLoading && !isEmpty(data)
        ? this.prepareData(this.props.data)
        : [];
    rows.totalHits = data.total;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            rows={rows}
            title={"Patron's current loans"}
            name={'current loans'}
            rowActionClickHandler={this.showDetailsHandler}
            seeAllComponent={this.seeAllButton()}
            showMaxRows={this.props.showMaxLoans}
          />
        </Error>
      </Loader>
    );
  }
}

PatronCurrentLoans.propTypes = {
  patron: PropTypes.number,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronCurrentLoans.defaultProps = {
  showMaxLoans: 5,
};
