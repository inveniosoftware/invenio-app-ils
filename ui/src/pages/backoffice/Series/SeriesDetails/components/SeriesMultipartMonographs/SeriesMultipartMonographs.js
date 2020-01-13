import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Loader, Error, ResultsTable, SeriesAuthors } from '@components';
import { series as seriesApi } from '@api';
import { BackOfficeRoutes } from '@routes/urls';
import { SeeAllButton } from '@pages/backoffice/components/buttons';
import _get from 'lodash/get';

export class SeriesMultipartMonographsData extends Component {
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
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.seriesDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
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
        relation.pid === this.seriesPid && relation.pid_type === 'serid'
    );
    return relation ? relation.volume : '?';
  };

  render() {
    const { multipartMonographs, isLoading, showMaxSeries, error } = this.props;
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Volume', formatter: this.volumeFormatter },
      { title: 'Title', field: 'metadata.title' },
      {
        title: 'Authors',
        formatter: ({ row }) => <SeriesAuthors metadata={row.metadata} />,
      },
    ];
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            data={multipartMonographs.hits}
            columns={columns}
            totalHitsCount={multipartMonographs.total}
            title={'Multipart Monographs'}
            name={'multipart monographs'}
            seeAllComponent={this.seeAllButton()}
            showMaxRows={showMaxSeries}
          />
        </Error>
      </Loader>
    );
  }
}

const SeriesMultipartMonographs = props => {
  const isSerial = props.seriesDetails.metadata.mode_of_issuance === 'SERIAL';
  return <>{isSerial && <SeriesMultipartMonographsData {...props} />}</>;
};

export default SeriesMultipartMonographs;

SeriesMultipartMonographs.propTypes = {
  showMaxSeries: PropTypes.number,
};

SeriesMultipartMonographs.defaultProps = {
  showMaxSeries: 5,
};
