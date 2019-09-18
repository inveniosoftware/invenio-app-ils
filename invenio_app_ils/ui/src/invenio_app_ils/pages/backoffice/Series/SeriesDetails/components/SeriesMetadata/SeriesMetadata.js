import React, { Component } from 'react';
import { Grid, Segment, Container, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { MetadataTable } from '../../../../components/MetadataTable';
import { EditButton } from '../../../../components/buttons';
import { DeleteRecordModal } from '../../../../components/DeleteRecordModal';
import { formatPidTypeToName } from '../../../../../../common/components/ManageRelationsButton/utils';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { goTo } from '../../../../../../history';

export default class SeriesMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteSeries = props.deleteSeries;
    this.seriesPid = this.props.seriesDetails.metadata.pid;
  }

  async getRelationRefs() {
    const hits = [];
    for (const [relation, records] of Object.entries(this.props.relations)) {
      for (const record of records) {
        const type = formatPidTypeToName(record.pid_type);
        hits.push({
          id: `${type} ${record.pid} (${relation})`,
        });
      }
    }
    const obj = {
      data: {
        hits: hits,
        total: hits.length,
      },
    };
    return obj;
  }

  createRefProps(seriesPid) {
    return [
      {
        refType: 'Related',
        onRefClick: () => {},
        getRefData: () => this.getRelationRefs(),
      },
    ];
  }

  renderHeader(series) {
    return (
      <Grid.Row>
        <Grid.Column width={13} verticalAlign={'middle'}>
          <Header as="h1">
            Series #{series.pid} - {series.metadata.title.title}
          </Header>
        </Grid.Column>
        <Grid.Column width={3} textAlign={'right'}>
          <EditButton
            clickHandler={() => {
              goTo(BackOfficeRoutes.seriesEditFor(this.seriesPid));
            }}
          />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Series record
            with ID ${series.pid}?`}
            refProps={this.createRefProps(series.pid)}
            onDelete={() => this.deleteSeries(series.pid)}
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
                <Header as="h3">Abstract</Header>
                <p>{series.metadata.abstract}</p>
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
