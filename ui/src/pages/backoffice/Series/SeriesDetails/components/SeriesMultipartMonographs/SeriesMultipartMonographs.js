import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import {
  Loader,
  Error,
  ResultsTable,
} from '../../../../../../common/components';
import { series as seriesApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { SeeAllButton } from '../../../../components/buttons';

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

  prepareData = multipartMonographs => {
    const { seriesDetails } = this.props;
    const serials = seriesDetails.metadata.relations.serial || [];
    const volumes = {};
    for (const serial of serials) {
      volumes[[serial.pid, serial.pid_type]] = serial.volume;
    }
    return multipartMonographs.hits.map(row => {
      const key = [row.metadata.pid, 'serid'];
      const volume = key in volumes ? volumes[key] : '?';
      row.volume = volume;
      return row;
    });
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

  render() {
    const { multipartMonographs, isLoading, showMaxSeries, error } = this.props;
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Volume', field: 'volume' },
      { title: 'Title', field: 'metadata.title' },
      { title: 'Authors', field: 'metadata.authors' },
    ];
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            data={this.prepareData(multipartMonographs)}
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
