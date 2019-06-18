import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { ResultsTable } from '../../../../../common/components';
import { document as documentApi } from '../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { SeeAllButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';
import { goTo, goToHandler } from '../../../../../history';

export default class SeriesDocuments extends Component {
  constructor(props) {
    super(props);
    this.fetchSeriesDocuments = props.fetchSeriesDocuments;
    this.showDetailsUrl = BackOfficeRoutes.documentDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.documentsListWithQuery;
  }

  componentDidMount() {
    this.fetchSeriesDocuments(this.props.series.series_pid);
  }

  seeAllButton = () => {
    const path = this.seeAllUrl(
      documentApi
        .query()
        .withSeriesPid(this.props.series.series_pid)
        .qs()
    );
    return <SeeAllButton clickHandler={goToHandler(path)} />;
  };

  prepareData(data) {
    const { series_pid } = this.props.series;
    return data.hits.map(row => {
      const entry = formatter.document.toTable(row, series_pid);
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
