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

const TableData = ({
  documents,
  data,
  showMaxDocuments,
  seeAllButton,
  showDetailsUrl,
}) => {
  const prepareData = documents => {
    const serials = data.metadata.relations.serial || [];
    const volumes = {};
    for (const serial of serials) {
      volumes[[serial.pid, serial.pid_type]] = serial.volume;
    }
    return documents.hits.map(row => {
      const key = [row.metadata.pid, 'docid'];
      const volume = key in volumes ? volumes[key] : '?';
      const entry = formatter.document.toTable(row, volume);
      return pick(entry, ['ID', 'Volume', 'Title', 'Authors']);
    });
  };
  const rows = prepareData(documents);
  rows.totalHits = documents.total;
  return (
    <ResultsTable
      rows={rows}
      title={'Documents'}
      name={'documents'}
      rowActionClickHandler={row => goTo(showDetailsUrl(row.ID))}
      seeAllComponent={seeAllButton()}
      showMaxRows={showMaxDocuments}
    />
  );
};

export default class SeriesDocuments extends Component {
  constructor(props) {
    super(props);
    this.showDetailsUrl = BackOfficeRoutes.documentDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.documentsListWithQuery;
    this.seriesPid = props.seriesDetails.metadata.pid;
    this.seriesType = props.seriesDetails.metadata.mode_of_issuance;
    this.fetchSeriesDocuments = props.fetchSeriesDocuments;
  }

  componentDidMount() {
    this.fetchSeriesDocuments(this.seriesPid, this.seriesType);
  }

  seeAllButton = () => {
    const path = this.seeAllUrl(
      documentApi
        .query()
        .withSeriesPid(this.seriesPid, this.seriesType)
        .qs()
    );
    return <SeeAllButton clickHandler={goToHandler(path)} />;
  };

  render() {
    const {
      seriesDetails,
      showMaxDocuments,
      seriesDocuments,
      isLoading,
      error,
    } = this.props;

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <TableData
            documents={seriesDocuments}
            data={seriesDetails}
            showMaxDocuments={showMaxDocuments}
            showDetailsUrl={this.showDetailsUrl}
            seeAllButton={this.seeAllButton}
          ></TableData>
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
