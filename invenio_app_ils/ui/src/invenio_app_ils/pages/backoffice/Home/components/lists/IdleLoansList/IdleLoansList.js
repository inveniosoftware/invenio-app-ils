import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../../common/components';
import { invenioConfig } from '../../../../../../common/config';
import { loan as loanApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { DateTime } from 'luxon';
import { SeeAllButton } from '../../../../components/buttons';
import { toShortDate } from '../../../../../../common/api/date';
import pick from 'lodash/pick';

export default class IdleLoansList extends Component {
  componentDidMount() {
    this.props.fetchIdlePendingLoans();
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withState(invenioConfig.circulation.loanRequestStates)
        .withUpdated({ to: toShortDate(DateTime.local().minus({ days: 10 })) })
        .qs()
    );
    return <SeeAllButton url={path} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      let serialized = formatter.loan.toTable(row);
      return pick(serialized, [
        'ID',
        'Updated',
        'Patron ID',
        'Document ID',
        'Requested',
      ]);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Idle loan requests'}
        subtitle={'Loan requests pending since more than 10 days.'}
        name={'idle loan requests'}
        rowActionClickHandler={BackOfficeRoutes.loanDetailsFor}
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
