import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../../common/components';
import { series as seriesApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { SeeAllButton } from '../../../../components/buttons';
import pick from 'lodash/pick';

const TableData = ({
  multipartMonographs,
  data,
  showMaxSeries,
  seeAllButton,
  showDetailsUrl,
}) => {
  const prepareData = multipartMonographs => {
    const serials = data.metadata.relations.serial || [];
    const volumes = {};
    for (const serial of serials) {
      volumes[[serial.pid, serial.pid_type]] = serial.volume;
    }
    return multipartMonographs.hits.map(row => {
      const key = [row.metadata.pid, 'serid'];
      const volume = key in volumes ? volumes[key] : '?';
      const entry = formatter.series.toTable(row);
      entry.Volume = volume;
      return pick(entry, ['ID', 'Volume', 'Title', 'Authors']);
    });
  };
  const rows = prepareData(multipartMonographs);
  rows.totalHits = multipartMonographs.total;
  return (
    <ResultsTable
      rows={rows}
      title={'Multipart Monographs'}
      name={'multipart monographs'}
      rowActionClickHandler={showDetailsUrl}
      seeAllComponent={seeAllButton()}
      showMaxRows={showMaxSeries}
    />
  );
};

class SeriesMultipartMonographsData extends Component {
  constructor(props) {
    super(props);
    this.seriesPid = props.seriesDetails.metadata.pid;
    this.seriesType = props.seriesDetails.metadata.mode_of_issuance;
  }

  componentDidMount() {
    this.props.fetchSeriesMultipartMonographs(this.seriesPid);
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.seriesListWithQuery(
      seriesApi
        .query()
        .withSerialPid(this.seriesPid)
        .qs()
    );
    return <SeeAllButton url={path} />;
  };

  render() {
    const {
      multipartMonographs,
      seriesDetails,
      isLoading,
      showMaxSeries,
      error,
    } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <TableData
            multipartMonographs={multipartMonographs}
            data={seriesDetails}
            showMaxSeries={showMaxSeries}
            seeAllButton={this.seeAllButton}
            showDetailsUrl={BackOfficeRoutes.seriesDetailsFor}
          ></TableData>
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
