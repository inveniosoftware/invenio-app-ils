import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Segment, Container, Header, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { MetadataTable } from '../../../components/MetadataTable';
import { EditButton } from '../../../components/buttons';
import {
  document as documentApi,
  series as seriesApi,
} from '../../../../../common/api';
import { BackOfficeRoutes, openRecordEditor } from '../../../../../routes/urls';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';

export default class SeriesMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteSeries = props.deleteSeries;
  }

  createRefProps(seriesPid) {
    return [
      {
        refType: 'Document',
        onRefClick: documentPid =>
          openRecordEditor(documentApi.url, documentPid),
        getRefData: () =>
          documentApi.list(
            documentApi
              .query()
              .withSeriesPid(seriesPid)
              .qs()
          ),
      },
    ];
  }

  renderKeywords(keywords) {
    return (
      <List horizontal>
        {keywords.map(keyword => (
          <List.Item key={keyword.keyword_pid}>
            <Link
              to={BackOfficeRoutes.seriesListWithQuery(
                seriesApi
                  .query()
                  .withKeyword(keyword)
                  .qs()
              )}
            >
              {keyword.name}
            </Link>
          </List.Item>
        ))}
      </List>
    );
  }

  renderHeader(series) {
    return (
      <Grid.Row>
        <Grid.Column width={13} verticalAlign={'middle'}>
          <Header as="h1">
            Series #{series.series_pid} - {series.metadata.title}
          </Header>
        </Grid.Column>
        <Grid.Column width={3} textAlign={'right'}>
          <EditButton
            clickHandler={() =>
              openRecordEditor(seriesApi.url, series.series_pid)
            }
          />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Series record
            with ID ${series.series_pid}?`}
            refProps={this.createRefProps(series.series_pid)}
            onDelete={() => this.deleteSeries(series.series_pid)}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }

  prepareData(series) {
    const rows = [
      { name: 'Title', value: series.metadata.title },
      { name: 'Mode of Issuance', value: series.metadata.mode_of_issuance },
      { name: 'Authors', value: series.metadata.authors },
    ];
    if (!isEmpty(series.metadata.keywords)) {
      rows.push({
        name: 'Keywords',
        value: this.renderKeywords(series.metadata.keywords),
      });
    }
    return rows;
  }

  render() {
    const series = this.props.seriesDetails;
    const rows = this.prepareData(series);
    return (
      <Segment className="series-metadata">
        <Grid padded columns={2}>
          {this.renderHeader(series)}
          <Grid.Row>
            <Grid.Column>
              <MetadataTable rows={rows} />
            </Grid.Column>
            <Grid.Column>
              <Container>
                <Header as="h3">Abstracts</Header>
                <p>{series.metadata.abstracts}</p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

SeriesMetadata.propTypes = {
  seriesDetails: PropTypes.object.isRequired,
};
