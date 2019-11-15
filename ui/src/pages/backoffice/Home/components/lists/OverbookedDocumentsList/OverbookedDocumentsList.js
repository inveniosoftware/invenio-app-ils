import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { Loader, Error, ResultsTable } from '@components';
import { document as documentApi } from '@api';
import { BackOfficeRoutes } from '@routes/urls';
import { SeeAllButton } from '@pages/backoffice/components/buttons';

export default class OverbookedDocumentsList extends Component {
  componentDidMount() {
    this.props.fetchOverbookedDocuments();
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.documentsListWithQuery(
      documentApi
        .query()
        .overbooked()
        .qs()
    );

    return <SeeAllButton to={path} />;
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.documentDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderTable(data) {
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Title', field: 'metadata.title' },
      {
        title: 'Pending Requests',
        field: 'metadata.circulation.pending_loans',
      },
    ];
    return (
      <ResultsTable
        data={data.hits}
        columns={columns}
        totalHitsCount={data.total}
        title={'Overbooked documents'}
        subtitle={
          'Documents with more requests than the number of available items for loan.'
        }
        name={'overbooked documents'}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxEntries}
        singleLine
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

OverbookedDocumentsList.propTypes = {
  fetchOverbookedDocuments: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxEntries: PropTypes.number,
};

OverbookedDocumentsList.defaultProps = {
  showMaxEntries: 5,
};
