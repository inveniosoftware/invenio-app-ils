import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { ResultsTable } from '../../../../../common/components';
import { item as itemApi } from '../../../../../common/api';

import { BackOfficeRoutes } from '../../../../../routes/urls';
import { SeeAllButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { goTo, goToHandler } from '../../../../../history';
import pick from 'lodash/pick';

export default class DocumentItems extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentItems = props.fetchDocumentItems;
    this.showDetailsUrl = BackOfficeRoutes.itemDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.itemsListWithQuery;
  }

  componentDidMount() {
    this.fetchDocumentItems(this.props.document.document_pid);
  }

  seeAllButton = () => {
    const path = this.seeAllUrl(
      itemApi
        .query()
        .withDocPid(this.props.document.document_pid)
        .qs()
    );
    return <SeeAllButton clickHandler={goToHandler(path)} />;
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
        rowActionClickHandler={row => goTo(this.showDetailsUrl(row.ID))}
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
  showMaxItems: 5,
};
