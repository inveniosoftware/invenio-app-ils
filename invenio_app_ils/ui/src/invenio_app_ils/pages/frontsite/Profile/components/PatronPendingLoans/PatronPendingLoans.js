import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';

import {
  Loader,
  Error,
  ResultsTable,
  Pagination,
  formatter,
} from '../../../../../common/components';
import { invenioConfig } from '../../../../../common/config';

export default class PatronPendingLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronPendingLoans = this.props.fetchPatronPendingLoans;
    this.patronPid = this.props.patronPid;
    this.state = { activePage: 1 };
  }

  componentDidMount() {
    this.fetchPatronPendingLoans(this.patronPid);
  }

  onPageChange = activePage => {
    this.fetchPatronPendingLoans(this.patronPid, activePage);
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
      return pick(formatter.loan.toTable(row), [
        'ID',
        'Document ID',
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
        title={'Your loan requests'}
        name={'loan requests'}
        showMaxRows={invenioConfig.default_results_size}
        paginationComponent={this.paginationComponent()}
        currentPage={this.state.activePage}
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

PatronPendingLoans.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
