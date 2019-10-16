import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../../common/components';
import { document as documentApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { SeeAllButton } from '../../../../components/buttons';
import pick from 'lodash/pick';

export default class PendingOverdueDocumentsList extends Component {
  componentDidMount() {
    this.props.fetchPendingOverdueDocuments();
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.documentsListWithQuery(
      documentApi
        .query()
        .pendingOverdue()
        .qs()
    );
    return <SeeAllButton url={path} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.document.toTable(row), [
        'ID',
        'Title',
        'Overdue Loans',
        'Pending Requests',
      ]);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Pending overdue documents'}
        subtitle={`Documents with pending loan requests, no available items and an active loan that's overdue.`}
        name={'pending overdue documents'}
        rowActionClickHandler={BackOfficeRoutes.documentDetailsFor}
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

PendingOverdueDocumentsList.propTypes = {
  fetchPendingOverdueDocuments: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

PendingOverdueDocumentsList.defaultProps = {
  showMaxEntries: 5,
};
