import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { ResultsTable } from '../../../../../../common/components';
import { document as documentApi } from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { SeeAllButton } from '../../../../components/buttons';
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';
import { goTo, goToHandler } from '../../../../../../history';

export default class SeriesDocuments extends Component {
  constructor(props) {
    super(props);
    this.fetchSeriesDocuments = props.fetchSeriesDocuments;
    this.showDetailsUrl = BackOfficeRoutes.documentDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.documentsListWithQuery;
  }

  componentDidMount() {
    const { series } = this.props;
    this.fetchSeriesDocuments(series.pid, series.metadata.mode_of_issuance);
  }

  seeAllButton = () => {
    const path = this.seeAllUrl(
      documentApi
        .query()
        .withSeriesPid(
          this.props.series.pid,
          this.props.series.metadata.mode_of_issuance
        )
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
      const key = [row.metadata.pid, 'docid'];
      const volume = key in volumes ? volumes[key] : '?';
      const entry = formatter.document.toTable(row, volume);
      return pick(entry, ['ID', 'Volume', 'Title', 'Authors']);
    });
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    return (
      <ResultsTable
        rows={rows}
        title={'Documents'}
        name={'documents'}
        rowActionClickHandler={row => goTo(this.showDetailsUrl(row.ID))}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.props.showMaxDocuments}
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

SeriesDocuments.propTypes = {
  series: PropTypes.object.isRequired,
  fetchSeriesDocuments: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxDocuments: PropTypes.number,
};

SeriesDocuments.defaultProps = {
  showMaxDocuments: 5,
};
