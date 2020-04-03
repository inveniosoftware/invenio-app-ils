import { InfoMessage } from '@pages/backoffice/components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error, ResultsTable } from '@components';
import { DocumentTitle } from '@components/Document';
import { document as documentApi } from '@api';
import {
  DocumentDetailsLink,
  SeeAllButton,
} from '@pages/backoffice/components/buttons';
import { BackOfficeRoutes } from '@routes/urls';
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
    const recordMetadata = row.metadata;
    const titleCmp = <DocumentTitle metadata={recordMetadata} />;
    return (
      <DocumentDetailsLink pidValue={recordMetadata.pid}>
        {titleCmp}
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
        relation.pid_value === this.seriesPid && relation.pid_type === 'serid'
    );
    return relation ? relation.volume : '-';
  };

  render() {
    const { showMaxDocuments, seriesDocuments, isLoading, error } = this.props;
    const columns = [
      { title: 'PID', field: 'metadata.pid' },
      { title: 'Title', field: '', formatter: this.viewDetails },
      { title: 'Volume', formatter: this.volumeFormatter },
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
                header="No documents in this series"
                content="Start from the document details to attach it to this series"
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
