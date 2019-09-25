import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api';
import './PatronLoans.scss';
import { invenioConfig } from '../../../../../common/config';
import { ResultsTable } from '../../../../../common/components';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../components/buttons';
import { goTo, goToHandler } from '../../../../../history';
import pick from 'lodash/pick';

export default class PatronPendingLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronPendingLoans = props.fetchPatronPendingLoans;
    this.showDetailsUrl = BackOfficeRoutes.loanDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.loansListWithQuery;
  }

  componentDidMount() {
    const patronPid = this.props.patronPid ? this.props.patronPid : null;
    this.fetchPatronPendingLoans(patronPid);
  }

  seeAllButton = () => {
    const { patronPid } = this.props;
    const path = this.seeAllUrl(
      loanApi
        .query()
        .withPatronPid(patronPid)
        .withState(invenioConfig.circulation.loanRequestStates)
        .qs()
    );
    return <SeeAllButton clickHandler={goToHandler(path)} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.loan.toTable(row), ['ID', 'Document ID']);
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
        rowActionClickHandler={row => goTo(this.showDetailsUrl(row.ID))}
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
  patronPid: PropTypes.string,
  fetchPatronPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronPendingLoans.defaultProps = {
  showMaxLoans: 5,
};
