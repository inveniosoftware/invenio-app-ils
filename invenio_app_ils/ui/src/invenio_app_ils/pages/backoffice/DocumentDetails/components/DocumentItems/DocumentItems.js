import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../common/components';
import { item as itemApi } from '../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { SeeAllButton } from '../../../components/buttons';
import pick from 'lodash/pick';

export default class DocumentItems extends Component {
  componentDidMount() {
    this.props.fetchDocumentItems(this.props.document.pid);
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.itemsListWithQuery(
      itemApi
        .query()
        .withDocPid(this.props.document.pid)
        .qs()
    );
    return <SeeAllButton url={path} />;
  };

  prepareData(data) {
    return data.hits.map(row => {
      const entry = formatter.item.toTable(row);
      return pick(entry, [
        'ID',
        'Barcode',
        'Status',
        'Medium',
        'Location',
        'Shelf',
      ]);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Attached items'}
        name={'attached items'}
        rowActionClickHandler={BackOfficeRoutes.itemDetailsFor}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxItems}
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

DocumentItems.propTypes = {
  document: PropTypes.object.isRequired,
  fetchDocumentItems: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxItems: PropTypes.number,
};

DocumentItems.defaultProps = {
  showMaxItems: 1,
};
