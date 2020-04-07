import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice/components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DocumentTitle } from '@components/Document';
import { Loader, Error, ResultsTable } from '@components';
import { series as seriesApi } from '@api';
import { SeeAllButton } from '@pages/backoffice/components/buttons';
import { BackOfficeRoutes } from '@routes/urls';
import _get from 'lodash/get';

export default class SeriesMultipartMonographs extends Component {
  constructor(props) {
    super(props);
    this.seriesPid = props.seriesDetails.metadata.pid;
    this.seriesType = props.seriesDetails.metadata.mode_of_issuance;
    this.fetchSeriesMultipartMonographs = props.fetchSeriesMultipartMonographs;
  }

  componentDidMount() {
    this.fetchSeriesMultipartMonographs(this.seriesPid);
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.seriesListWithQuery(
      seriesApi
        .query()
        .withSerialPid(this.seriesPid)
        .qs()
    );
    return <SeeAllButton to={path} />;
  };

  viewDetails = ({ row }) => {
    const recordMetadata = row.metadata;
    const titleCmp = <DocumentTitle metadata={recordMetadata} />;
    return (
      <SeriesDetailsLink pidValue={recordMetadata.pid}>
        {titleCmp}
      </SeriesDetailsLink>
    );
  };

  volumeFormatter = ({ row }) => {
    // Find the series volume for the parent series
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
    const { multipartMonographs, isLoading, showMaxSeries, error } = this.props;
    const columns = [
      { title: 'PID', field: 'metadata.pid' },
      { title: 'Title', field: '', formatter: this.viewDetails },
      { title: 'Volume', formatter: this.volumeFormatter },
    ];
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            data={multipartMonographs.hits}
            columns={columns}
            totalHitsCount={multipartMonographs.total}
            name={'multipart monographs'}
            seeAllComponent={this.seeAllButton()}
            showMaxRows={showMaxSeries}
            renderEmptyResultsElement={() => (
              <InfoMessage
                header="No multipart monographs in this series"
                content="Start from the multipart monograph details to attach it to this series"
                data-test="no-results"
              />
            )}
          />
        </Error>
      </Loader>
    );
  }
}

SeriesMultipartMonographs.propTypes = {
  showMaxSeries: PropTypes.number,
};

SeriesMultipartMonographs.defaultProps = {
  showMaxSeries: 5,
};
