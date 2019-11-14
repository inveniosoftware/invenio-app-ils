import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import {
  Loader,
  Error,
  ResultsTable,
} from '@components';
import { document as documentApi } from '@api';
import { BackOfficeRoutes } from '@routes/urls';
import { SeeAllButton } from '../../../../components/buttons';
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

  prepareData = documents => {
    const { seriesDetails } = this.props;
    const serials = seriesDetails.metadata.relations.serial || [];
    const volumes = {};
    for (const serial of serials) {
      volumes[[serial.pid, serial.pid_type]] = serial.volume;
    }
    const curratedDocs = documents.hits.map(row => {
      const key = [row.metadata.pid, 'docid'];
      // NOTE: Not good, adding property volume to document
      row.volume = key in volumes ? volumes[key] : '?';
      return row;
    });
    return curratedDocs;
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.documentDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  render() {
    const { showMaxDocuments, seriesDocuments, isLoading, error } = this.props;
    const curratedData = this.prepareData(seriesDocuments);
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Volume', field: 'volume' },
      { title: 'Title', field: 'metadata.title' },
      {
        title: 'Authors',
        field: 'metadata.authors',
        formatter: ({ col, row }) => {
          if (_get(col.field, row) && Array.isArray(row[col.field])) {
            return row[col.field].map(author => author.full_name);
          }
          return '';
        },
      },
    ];
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <ResultsTable
            data={curratedData}
            columns={columns}
            totalHitsCount={seriesDocuments.total}
            title={'Documents'}
            name={'documents'}
            seeAllComponent={this.seeAllButton()}
            showMaxRows={showMaxDocuments}
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
