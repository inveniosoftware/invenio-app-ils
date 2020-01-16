import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Loader, Error, ResultsTable } from '@components';
import { item as itemApi } from '@api';
import { BackOfficeRoutes } from '@routes/urls';
import { SeeAllButton } from '@pages/backoffice/components/buttons';
import _get from 'lodash/get';

export default class DocumentItems extends Component {
  componentDidMount() {
    this.props.fetchDocumentItems(this.props.documentDetails.pid);
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.itemsListWithQuery(
      itemApi
        .query()
        .withDocPid(this.props.documentDetails.pid)
        .qs()
    );
    return <SeeAllButton to={path} />;
  };

  viewDetails = ({ row }) => {
    return (
      <Link
        to={BackOfficeRoutes.itemDetailsFor(row.metadata.pid)}
        data-test={row.metadata.pid}
      >
        {row.metadata.barcode}
      </Link>
    );
  };

  renderTable(data) {
    const columns = [
      {
        title: 'Barcode',
        field: 'metadata.barcode',
        formatter: this.viewDetails,
      },
      { title: 'Status', field: 'metadata.status' },
      { title: 'Medium', field: 'metadata.medium' },
      { title: 'Location', field: 'metadata.internal_location.name' },
      { title: 'Shelf', field: 'metadata.shelf' },
      { title: 'Restrictions', field: 'metadata.circulation_restriction' },
      {
        title: 'Loan Status',
        field: 'metadata.circulation.state',
        formatter: ({ row, col }) => {
          if (_get(row, col.field) === 'ITEM_ON_LOAN') {
            return (
              <Link
                to={BackOfficeRoutes.loanDetailsFor(
                  row.metadata.circulation.loan_pid
                )}
              >
                on loan
              </Link>
            );
          }
          return _get(row, col.field) || '-';
        },
      },
    ];
    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCount={data.total}
        name={'attached items'}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  render() {
    const { documentItems, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderTable(documentItems)}</Error>
      </Loader>
    );
  }
}

DocumentItems.propTypes = {
  documentItems: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
  fetchDocumentItems: PropTypes.func.isRequired,
  showMaxItems: PropTypes.number,
};

DocumentItems.defaultProps = {
  showMaxItems: 5,
};
