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

export default class OverbookedDocumentsList extends Component {
  componentDidMount() {
    this.props.fetchOverbookedDocuments();
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.documentsListWithQuery(
      documentApi
        .query()
        .overbooked()
        .qs()
    );
    return <SeeAllButton url={path} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      let entry = formatter.document.toTable(row);
      return pick(entry, ['ID', 'Title', 'Pending Requests']);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Overbooked documents'}
        subtitle={
          'Documents with more requests than the number of available items for loan.'
        }
        name={'overbooked documents'}
        rowActionClickHandler={BackOfficeRoutes.documentDetailsFor}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxEntries}
        singleLine
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

OverbookedDocumentsList.propTypes = {
  fetchOverbookedDocuments: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

OverbookedDocumentsList.defaultProps = {
  showMaxEntries: 5,
};
