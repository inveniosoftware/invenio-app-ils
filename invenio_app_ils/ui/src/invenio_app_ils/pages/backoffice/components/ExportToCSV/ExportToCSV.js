import React, { Component } from 'react';
import { Button, Grid, Popup, Header } from 'semantic-ui-react';
import { InvenioRequestSerializer } from 'react-searchkit/es/contrib/Serializers';
import { withQueryComponent } from 'react-searchkit';

class ExportButton extends Component {
  render() {
    return (
      <Popup
        trigger={<Button primary>Export to CSV</Button>}
        flowing
        on="click"
      >
        <Grid>
          <Grid.Column textAlign="center">
            <Header as="h4">
              <p>Found {this.props.totalResults} records</p>
            </Header>
            <Button.Group>
              <Button
                labelPosition="left"
                icon="left chevron"
                primary
                disabled={this.props.recordsFrom === 0}
                content={`Previous ${this.props.dlSize}`}
                onClick={() => this.navigateRecords('back')}
              />
              <Button
                icon="download"
                primary
                content={`${this.props.recordsFrom} to ${this.props.recordsTo}`}
                onClick={async () => {
                  await this.downloadCSV(
                    this.exportQuery,
                    this.props.queryState
                  );
                  this.downloadFile(this.props.csvData);
                }}
              />
              <Button
                labelPosition="right"
                icon="right chevron"
                primary
                disabled={this.props.recordsTo === this.props.totalRecords}
                content={`Next ${this.props.dlSize}`}
                onClick={() => this.navigateRecords('next')}
              />
            </Button.Group>
          </Grid.Column>
        </Grid>
      </Popup>
    );
  }
}

export default class ExportToCSV extends Component {
  constructor(props) {
    super(props);
    this.fetchCount = props.fetchCount;
    this.navigateRecords = props.navigateRecords;
    this.downloadCSV = props.downloadCSV;
    this.countQuery = props.countQuery;
    this.exportQuery = props.exportQuery;
    this.currentQueryString = props.currentQueryString;
    this.requestSerializer = new InvenioRequestSerializer();
  }

  componentDidMount() {
    this.fetchCount('', this.countQuery);
  }

  downloadFile(csvData) {
    const element = document.createElement('a');
    const file = new Blob([csvData], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = 'export.csv';
    document.body.appendChild(element);
    element.click();
  }

  render() {
    const Query = withQueryComponent(ExportButton);
    return <Query />;
  }
}
