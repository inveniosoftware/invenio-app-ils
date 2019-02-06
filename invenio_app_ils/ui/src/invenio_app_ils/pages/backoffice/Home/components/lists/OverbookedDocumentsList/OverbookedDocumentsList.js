import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { generatePath } from 'react-router';
import { Loader, Error } from '../../../../../../common/components';
import { ResultsTable } from '../../../../../../common/components';
import {
  loan as loanApi,
  document as documentApi,
} from '../../../../../../common/api';

import {
  BackOfficeURLS,
  loanSearchQueryUrl,
} from '../../../../../../common/urls';

export default class OverbookedDocumentsList extends Component {
  constructor(props) {
    super(props);
    this.fetchOverbookedDocuments = props.fetchOverbookedDocuments;
    this.showDetailsUrl = BackOfficeURLS.documentDetails;
    this.showAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    this.fetchOverbookedDocuments();
  }

  _showDetailsHandler = document_pid =>
    this.props.history.push(
      generatePath(this.showDetailsUrl, { documentPid: document_pid })
    );

  _showAllHandler = params => {
    this.props.history.push(
      this.showAllUrl(
        loanApi
          .query()
          .withState('PENDING')
          .qs()
      )
    );
  };

  prepareData() {
    return this.props.data.map(row => documentApi.serializer.toTableView(row));
  }

  _render_table() {
    const rows = this.prepareData();
    return (
      <ResultsTable
        rows={rows}
        name={'Overbooked documents'}
        actionClickHandler={this._showDetailsHandler}
        showAllClickHandler={{
          handler: this._showAllHandler,
          params: null,
        }}
        showMaxRows={this.props.showMaxEntries}
        fixed
        singleLine
      />
    );
  }

  render() {
    const { data, isLoading, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>{this._render_table()}</Error>
      </Loader>
    );
  }
}

OverbookedDocumentsList.propTypes = {
  fetchOverbookedDocuments: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  showMaxEntries: PropTypes.number,
};

OverbookedDocumentsList.defaultProps = {
  showMaxEntries: 5,
};
