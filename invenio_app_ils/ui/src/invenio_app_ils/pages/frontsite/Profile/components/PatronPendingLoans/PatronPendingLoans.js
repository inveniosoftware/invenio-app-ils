import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  Pagination,
} from '../../../../../common/components';
import { dateFormatter } from '../../../../../common/api/date';
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

  renderTable(data) {
    const columns = [
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Document ID', field: 'metadata.document_pid' },
      {
        title: 'Request start date',
        field: 'metadata.request_start_date',
        formatter: dateFormatter,
      },
      {
        title: 'Request end date',
        field: 'metadata.request_expire_date',
        formatter: dateFormatter,
      },
    ];

    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCount={data.total}
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
