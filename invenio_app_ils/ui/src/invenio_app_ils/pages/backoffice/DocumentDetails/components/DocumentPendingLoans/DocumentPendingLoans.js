import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { ResultsTable } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api';

import { BackOfficeRoutes } from '../../../../../routes/urls';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../components/buttons';
import { goTo, goToHandler } from '../../../../../history';
import pick from 'lodash/pick';

export default class DocumentPendingLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPendingLoans = props.fetchPendingLoans;
    this.showDetailsUrl = BackOfficeRoutes.loanDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.loansListWithQuery;
  }

  componentDidMount() {
    const { document_pid } = this.props.document;
    this.fetchPendingLoans(document_pid);
  }

  seeAllButton = () => {
    const { document_pid } = this.props.document;
    const path = this.seeAllUrl(
      loanApi
        .query()
        .withDocPid(document_pid)
        .withState('PENDING')
        .qs()
    );
    return <SeeAllButton clickHandler={goToHandler(path)} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      const serialized = formatter.loan.toTable(row);
      return pick(serialized, ['ID', 'Updated', 'Patron ID', 'Start date']);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Pending loans requests'}
        name={'pending loan requests'}
        rowActionClickHandler={row => goTo(this.showDetailsUrl(row.ID))}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxPendingLoans}
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

DocumentPendingLoans.propTypes = {
  document: PropTypes.object.isRequired,
  fetchPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxPendingLoans: PropTypes.number,
};

DocumentPendingLoans.defaultProps = {
  showMaxPendingLoans: 5,
};
