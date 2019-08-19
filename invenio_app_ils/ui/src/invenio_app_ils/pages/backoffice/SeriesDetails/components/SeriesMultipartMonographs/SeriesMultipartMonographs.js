import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { ResultsTable } from '../../../../../common/components';
import { series as seriesApi } from '../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { SeeAllButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';
import { goTo, goToHandler } from '../../../../../history';

export default class SeriesMultipartMonographs extends Component {
  constructor(props) {
    super(props);
    this.fetchSeriesMultipartMonographs = props.fetchSeriesMultipartMonographs;
    this.showDetailsUrl = BackOfficeRoutes.seriesDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.seriesListWithQuery;
  }

  componentDidMount() {
    const { series } = this.props;
    this.fetchSeriesMultipartMonographs(series.pid);
  }

  seeAllButton = () => {
    const path = this.seeAllUrl(
      seriesApi
        .query()
        .withSerialPid(this.props.series.pid)
        .qs()
    );
    return <SeeAllButton clickHandler={goToHandler(path)} />;
  };

  prepareData(data) {
    const serials = this.props.series.metadata.relations.serial || [];
    const volumes = {};
    for (const serial of serials) {
      volumes[[serial.pid, serial.pid_type]] = serial.volume;
    }
    return data.hits.map(row => {
      const key = [row.metadata.pid, 'serid'];
      const volume = key in volumes ? volumes[key] : '?';
      const entry = formatter.series.toTable(row);
      entry.Volume = volume;
      return pick(entry, ['ID', 'Volume', 'Title', 'Authors']);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Multipart Monographs'}
        name={'multipart monographs'}
        rowActionClickHandler={row => goTo(this.showDetailsUrl(row.ID))}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxSeries}
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

SeriesMultipartMonographs.propTypes = {
  series: PropTypes.object.isRequired,
  fetchSeriesMultipartMonographs: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxSeries: PropTypes.number,
};

SeriesMultipartMonographs.defaultProps = {
  showMaxSeries: 5,
};
