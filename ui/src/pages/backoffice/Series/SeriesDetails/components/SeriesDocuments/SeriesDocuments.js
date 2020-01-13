import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { Loader, Error, ResultsTable, DocumentAuthors } from '@components';
import { document as documentApi } from '@api';
import { BackOfficeRoutes } from '@routes/urls';
import { SeeAllButton } from '@pages/backoffice/components/buttons';
import _get from 'lodash/get';

export default class SeriesDocuments extends Component {
  constructor(props) {
    super(props);
    this.seriesPid = props.seriesDetails.metadata.pid;
    this.seriesType = props.seriesDetails.metadata.mode_of_issuance;
  }

  componentDidMount() {
    this.props.fetchSeriesDocuments(this.seriesPid, this.seriesType);
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.documentsListWithQuery(
      documentApi
        .query()
        .withSeriesPid(this.seriesPid, this.seriesType)
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

  volumeFormatter = ({ row }) => {
    // Find the document volume for the parent series
    const relation = _get(
      row,
      `metadata.relations.${this.seriesType.toLowerCase()}`,
      []
    ).find(
      relation =>
        relation.pid === this.seriesPid && relation.pid_type === 'serid'
    );
    return relation ? relation.volume : '?';
  };

  render() {
    const { showMaxDocuments, seriesDocuments, isLoading, error } = this.props;
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Volume', formatter: this.volumeFormatter },
      { title: 'Title', field: 'metadata.title' },
      {
        title: 'Authors',
        formatter: ({ row }) => <DocumentAuthors metadata={row.metadata} />,
      },
    ];
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            data={seriesDocuments.hits}
            columns={columns}
            totalHitsCount={seriesDocuments.total}
            title={'Documents'}
            name={'documents'}
            seeAllComponent={this.seeAllButton()}
            showMaxRows={showMaxDocuments}
          />
        </Error>
      </Loader>
    );
  }
}

SeriesDocuments.propTypes = {
  showMaxDocuments: PropTypes.number,
};

SeriesDocuments.defaultProps = {
  showMaxDocuments: 5,
};
