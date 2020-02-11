import { ResultsTable, SeriesAuthors } from '@components';
import { SeriesLanguages } from '@components/Series';
import { UrlList } from '@pages/backoffice/components/UrlList';
import get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Divider, Container } from 'semantic-ui-react';
import { MetadataTable } from '@pages/backoffice/components/MetadataTable';
import isEmpty from 'lodash/isEmpty';

export default class SeriesMetadata extends Component {
  prepareData = () => {
    const { seriesDetails } = this.props;

    const urls = get(this.props, 'seriesDetails.metadata.urls', []);

    return [
      { name: 'Title', value: seriesDetails.metadata.title },
      {
        name: 'Title abbreviation',
        value: seriesDetails.metadata.abbreviated_title,
      },
      {
        name: 'Authors',
        value: <SeriesAuthors metadata={seriesDetails.metadata} />,
      },
      {
        name: 'Mode of Issuance',
        value: seriesDetails.metadata.mode_of_issuance,
      },
      {
        name: 'Languages',
        value: <SeriesLanguages metadata={seriesDetails.metadata} />,
      },
      { name: 'Publisher', value: seriesDetails.metadata.publisher },
      { name: 'Urls', value: <UrlList urls={urls} /> },
    ];
  };

  render() {
    const series = this.props.seriesDetails;
    const rows = this.prepareData();
    const columns = [
      {
        title: 'URL',
        field: 'url',
      },
      {
        title: 'Description',
        field: 'description',
      },
      { title: 'Open access', field: 'open_access' },
      { title: 'Restrictions', field: 'access_restriction' },
    ];

    const hasAccessUrls = !isEmpty(series.metadata.access_urls);

    return (
      <Container fluid className="series-metadata">
        <MetadataTable rows={rows} />

        {hasAccessUrls && (
          <>
            <Divider horizontal>Access URLS</Divider>
            <ResultsTable
              columns={columns}
              data={series.metadata.access_urls}
            />
          </>
        )}
      </Container>
    );
  }
}

SeriesMetadata.propTypes = {
  seriesDetails: PropTypes.object.isRequired,
};
