import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api';
import { invenioConfig } from '../../../../../common/config';
import { ResultsTable, formatter } from '../../../../../common/components';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { SeeAllButton } from '../../../components/buttons';
import pick from 'lodash/pick';

export default class PatronPendingLoans extends Component {
  componentDidMount() {
    const patronPid = this.props.patronPid ? this.props.patronPid : null;
    this.props.fetchPatronPendingLoans(patronPid);
  }

  seeAllButton = () => {
    const { patronPid } = this.props;
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withPatronPid(patronPid)
        .withState(invenioConfig.circulation.loanRequestStates)
        .qs()
    );
    return <SeeAllButton url={path} />;
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
        rowActionClickHandler={BackOfficeRoutes.loanDetailsFor}
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
