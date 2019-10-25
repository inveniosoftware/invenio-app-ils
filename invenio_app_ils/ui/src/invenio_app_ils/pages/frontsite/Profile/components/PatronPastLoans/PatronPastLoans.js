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

export default class PatronPastLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronPastLoans = this.props.fetchPatronPastLoans;
    this.patronPid = this.props.patronPid;
    this.state = { activePage: 1 };
  }

  componentDidMount() {
    this.fetchPatronPastLoans(this.patronPid);
  }

  onPageChange = activePage => {
    this.fetchPatronPastLoans(this.patronPid, activePage);
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

  render() {
    const { data, isLoading, error } = this.props;
    const columns = [
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Item barcode', field: 'metadata.item.barcode' },
      {
        title: 'Start date',
        field: 'metadata.start_date',
        formatter: dateFormatter,
      },
      {
        title: 'End date',
        field: 'metadata.end_date',
        formatter: dateFormatter,
      },
      { title: 'Renewals', field: 'metadata.extension_count' },
    ];
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            data={data.hits}
            columns={columns}
            totalHitsCount={data.total}
            title={'Your past loans'}
            name={'past loans'}
            showMaxRows={invenioConfig.default_results_size}
            paginationComponent={this.paginationComponent()}
            currentPage={this.state.activePage}
          />
        </Error>
      </Loader>
    );
  }
}

PatronPastLoans.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronPastLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
