import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api/';
import './PatronLoans.scss';

import { ResultsTable } from '../../../../../common/components';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../components/buttons';
import pick from 'lodash/pick';

export default class PatronPendingLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronPendingLoans = props.fetchPatronPendingLoans;
    this.showDetailsUrl = BackOfficeRoutes.loanDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.loansListWithQuery;
  }

  componentDidMount() {
    const patronPid = this.props.patron ? this.props.patron : null;
    this.fetchPatronPendingLoans(patronPid);
  }

  showDetailsHandler = loanPid =>
    this.props.history.push(this.showDetailsUrl(loanPid));

  seeAllButton = () => {
    const { patron } = this.props;
    const click = () =>
      this.props.history.push(
        this.seeAllUrl(
          loanApi
            .query()
            .withPatronPid(patron)
            .withState('PENDING')
            .qs()
        )
      );
    return <SeeAllButton clickHandler={() => click()} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.loan.toTable(row), [
        'ID',
        'Updated',
        'Document ID',
        'Start date',
        'Expiration date',
      ]);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={"Patron's loan requests"}
        name={'loan requests'}
        rowActionClickHandler={this.showDetailsHandler}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxLoans}
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

PatronPendingLoans.propTypes = {
  patron: PropTypes.number,
  fetchPatronPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronPendingLoans.defaultProps = {
  showMaxLoans: 5,
};
