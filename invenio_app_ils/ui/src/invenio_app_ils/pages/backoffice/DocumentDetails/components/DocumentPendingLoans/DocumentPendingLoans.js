import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api';
import { invenioConfig } from '../../../../../common/config';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { SeeAllButton } from '../../../components/buttons';
import pick from 'lodash/pick';

export default class DocumentPendingLoans extends Component {
  componentDidMount() {
    const { pid } = this.props.document;
    this.props.fetchPendingLoans(pid);
  }

  seeAllButton = () => {
    const { pid } = this.props.document;
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withDocPid(pid)
        .withState(invenioConfig.circulation.loanRequestStates)
        .qs()
    );
    return <SeeAllButton url={path} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      const serialized = formatter.loan.toTable(row);
      return pick(serialized, [
        'ID',
        'Patron',
        'Request start date',
        'Request end date',
      ]);
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
        rowActionClickHandler={BackOfficeRoutes.loanDetailsFor}
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
