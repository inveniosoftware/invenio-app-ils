import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { toShortDateTime } from '../../../../../common/api/date';
import { ResultsTable } from '../../../../../common/components';
import { item as itemApi } from '../../../../../common/api';

import {
  itemSearchQueryUrl,
  viewItemDetailsUrl,
} from '../../../../../common/urls';
import { SeeAllButton } from '../../../components/buttons';

export default class DocumentItems extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentItems = props.fetchDocumentItems;
    this.showDetailsUrl = viewItemDetailsUrl;
    this.seeAllUrl = itemSearchQueryUrl;
  }

  componentDidMount() {
    const { document_pid } = this.props.document;
    this.fetchDocumentItems(document_pid);
  }

  _getFormattedDate = d => (d ? toShortDateTime(d) : '');

  _showDetailsHandler = item_pid =>
    this.props.history.push(this.showDetailsUrl(item_pid));

  _seeAllButton = () => {
    const { document_pid } = this.props.document;
    const _click = () =>
      this.props.history.push(
        this.seeAllUrl(
          itemApi
            .query()
            .withDocPid(document_pid)
            .qs()
        )
      );
    return <SeeAllButton clickHandler={() => _click()} />;
  };

  prepareData(data) {
    return data.hits.map(row => ({
      ID: row.item_pid,
      Updated: this._getFormattedDate(row.updated),
      Barcode: row.barcode,
      Medium: row.medium,
      Status: row.status,
      Location: row.location ? row.location : '-',
      Shelf: row.shelf,
    }));
  }

  _render_table(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Attached items'}
        rowActionClickHandler={this._showDetailsHandler}
        seeAllComponent={this._seeAllButton()}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this._render_table(data)}</Error>
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
