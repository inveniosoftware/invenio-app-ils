import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { ResultsTable } from '../../../../../../common/components';
import { loan as loanApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { DateTime } from 'luxon';
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../../components/buttons';
import { goTo, goToHandler } from '../../../../../../history';
import { toShortDate } from '../../../../../../common/api/date';
import pick from 'lodash/pick';

export default class IdleLoansList extends Component {
  constructor(props) {
    super(props);
    this.fetchIdlePendingLoans = props.fetchIdlePendingLoans;
    this.showDetailsUrl = BackOfficeRoutes.loanDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.loansListWithQuery;
  }

  componentDidMount() {
    this.fetchIdlePendingLoans();
  }

  seeAllButton = () => {
    const path = this.seeAllUrl(
      loanApi
        .query()
        .withState('PENDING')
        .withUpdated({ to: toShortDate(DateTime.local().minus({ days: 10 })) })
        .qs()
    );
    return <SeeAllButton clickHandler={goToHandler(path)} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      let serialized = formatter.loan.toTable(row);
      return pick(serialized, [
        'ID',
        'Updated',
        'Patron ID',
        'Document ID',
        'Start date',
      ]);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Idle loans'}
        subtitle={'Loan requests in PENDING state longer than 10 days.'}
        name={'idle loans'}
        rowActionClickHandler={row => goTo(this.showDetailsUrl(row.ID))}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxEntries}
      />
    );
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderTable(data)}</Error>
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
