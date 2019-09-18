import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

import {
  Loader,
  Error,
  ResultsTable,
  Pagination,
} from '../../../../../common/components';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { invenioConfig } from '../../../../../common/config';

export default class PatronDocumentRequests extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronDocumentRequests = this.props.fetchPatronDocumentRequests;
    this.patronPid = this.props.patronPid;
    this.state = { activePage: 1 };
  }

  componentDidMount() {
    this.fetchPatronDocumentRequests(this.patronPid);
  }

  onPageChange = activePage => {
    this.fetchPatronDocumentRequests(this.patronPid, activePage);
    this.setState({ activePage: activePage });
  };

  paginationComponent = () => {
    return (
      <Pagination
        currentPage={this.state.activePage}
        currentSize={invenioConfig.default_results_size}
        loading={this.props.isLoading}
        totalResults={this.props.data.total}
        onPageChange={this.onPageChange}
      />
    );
  };

  prepareData(data) {
    return data.hits.map(row => {
      return pick(formatter.documentRequest.toTable(row), [
        'ID',
        'Title',
        'Library Book',
        'Created',
      ]);
    });
  }

  render() {
    const { data, isLoading, hasError, error } = this.props;
    const rows =
      !hasError && !isLoading && !isEmpty(data)
        ? this.prepareData(this.props.data)
        : [];
    rows.totalHits = data.total;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            rows={rows}
            title={'Your book requests'}
            name={'book requests'}
            showMaxRows={invenioConfig.default_results_size}
            paginationComponent={this.paginationComponent()}
            currentPage={this.state.activePage}
          />
        </Error>
      </Loader>
    );
  }
}

PatronDocumentRequests.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronDocumentRequests: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
};
