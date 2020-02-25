import { eitem as eItemApi } from '@api';
import { Error, Loader, ResultsTable } from '@components';
import { OpenAccessLabel } from '@pages/backoffice/components';
import { SeeAllButton } from '@pages/backoffice/components/buttons';
import { BackOfficeRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class DocumentEItems extends Component {
  componentDidMount() {
    this.props.fetchDocumentEItems(this.props.documentDetails.pid);
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.eItemsListWithQuery(
      eItemApi
        .query()
        .withDocPid(this.props.documentDetails.pid)
        .qs()
    );
    return <SeeAllButton to={path} />;
  };

  viewDetails = ({ row }) => {
    return (
      <Link
        to={BackOfficeRoutes.eitemDetailsFor(row.metadata.pid)}
        data-test={row.metadata.pid}
      >
        {row.metadata.pid}
      </Link>
    );
  };

  filesFieldFormatter = ({ row }) => {
    return row.metadata.files.length;
  };

  accessFormatter = ({ row }) => {
    return (
      <OpenAccessLabel openAccess={row.metadata.open_access} size="tiny" />
    );
  };

  renderTable(data) {
    const columns = [
      {
        title: 'PID',
        field: '',
        formatter: this.viewDetails,
      },
      {
        title: 'Files',
        field: 'metadata.files',
        formatter: this.filesFieldFormatter,
      },
      {
        title: 'Access',
        field: 'metadata.open_access',
        formatter: this.accessFormatter,
      },
    ];
    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCount={data.total}
        name={'attached e-items'}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxItems}
      />
    );
  }

  render() {
    const { documentEItems, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderTable(documentEItems)}</Error>
      </Loader>
    );
  }
}

DocumentEItems.propTypes = {
  documentEItems: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
  fetchDocumentEItems: PropTypes.func.isRequired,
  showMaxItems: PropTypes.number,
};

DocumentEItems.defaultProps = {
  showMaxItems: 5,
};
