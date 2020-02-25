import { document as documentApi } from '@api';
import { DocumentAuthors, Error, Loader, ResultsTable } from '@components';
import { InfoMessage } from '@pages/backoffice/components';
import {
  DocumentDetailsLink,
  SeeAllButton,
} from '@pages/backoffice/components/buttons';
import { BackOfficeRoutes } from '@routes/urls';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

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
      <DocumentDetailsLink documentPid={row.pid}>
        {row.metadata.title}
      </DocumentDetailsLink>
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
      { title: 'Title', field: 'metadata.title', formatter: this.viewDetails },
      {
        title: 'Authors',
        formatter: ({ row }) => <DocumentAuthors metadata={row.metadata} />,
      },
      { title: 'Volume', formatter: this.volumeFormatter },
      { title: 'ID', field: 'metadata.pid' },
    ];
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            data={seriesDocuments.hits}
            columns={columns}
            totalHitsCount={seriesDocuments.total}
            name={'documents'}
            seeAllComponent={this.seeAllButton()}
            showMaxRows={showMaxDocuments}
            renderEmptyResultsElement={() => (
              <InfoMessage
                header="No volumes in this series."
                content="Start from a book/article to attach it to this series."
                data-test="no-results"
              />
            )}
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
