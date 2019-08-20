import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { ResultsTable } from '../../../../../../common/components';
import { document as documentApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../../components/buttons';
import { goTo, goToHandler } from '../../../../../../history';
import pick from 'lodash/pick';

export default class PendingOverdueDocumentsList extends Component {
  constructor(props) {
    super(props);
    this.fetchPendingOverdueDocuments = props.fetchPendingOverdueDocuments;
    this.showDetailsUrl = BackOfficeRoutes.documentDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.documentsListWithQuery;
  }

  componentDidMount() {
    this.fetchPendingOverdueDocuments();
  }

  seeAllButton = () => {
    const path = this.seeAllUrl(
      documentApi
        .query()
        .pendingOverdue()
        .qs()
    );
    return <SeeAllButton clickHandler={goToHandler(path)} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.document.toTable(row), [
        'ID',
        'Title',
        'Overdue Loans',
        'Pending Requests',
        'Available Items',
      ]);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Pending Overdue Documents'}
        subtitle={`Documents with pending loan requests, no available items and an active loan that's overdue.`}
        name={'pending overdue documents'}
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

PendingOverdueDocumentsList.propTypes = {
  fetchPendingOverdueDocuments: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

PendingOverdueDocumentsList.defaultProps = {
  showMaxEntries: 5,
};
