import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Qs from 'qs';
import { Grid, List, Header } from 'semantic-ui-react';
import { DatePicker, Loader, Error } from '@components';
import { BackOfficeRoutes } from '@routes/urls';
import { circulationStats as circulationStatsApi, loan as loanApi } from '@api';
import { DocumentList, ExportSearchResults } from '../../components';
import { invenioConfig } from '@config/invenioConfig';
import {
  DocumentListEntry,
  DocumentStats,
} from '../../components/DocumentList';

export default class MostLoanedDocumentsList extends Component {
  constructor(props) {
    super(props);
    this.fetchMostLoanedDocuments = props.fetchMostLoanedDocuments;
    this.showDetailsUrl = BackOfficeRoutes.documentDetailsFor;
    this.state = {
      fromDate: '',
      toDate: '',
    };
  }

  get subtitle() {
    const { fromDate, toDate } = this.state;
    const total = this.props.data.total;
    const msg = `Showing the ${total} most checked-out documents`;

    if (fromDate && toDate) {
      return `${msg} between ${fromDate} and ${toDate}.`;
    } else if (fromDate) {
      return `${msg} starting from ${fromDate}.`;
    } else if (toDate) {
      return `${msg} ending at ${toDate}.`;
    } else {
      return `${msg}.`;
    }
  }

  componentDidMount() {
    this.fetchDocuments();
  }

  fetchDocuments() {
    this.fetchMostLoanedDocuments(this.state.fromDate, this.state.toDate);
  }

  handleFromDateChange = value => {
    this.setState({ fromDate: value }, this.fetchDocuments);
  };

  handleToDateChange = value => {
    this.setState({ toDate: value }, this.fetchDocuments);
  };

  renderDateRangePicker() {
    return (
      <>
        <Header as="h3">
          Pick range of dates
          <Header.Subheader>
            Choose between which dates to search the most loaned documents
          </Header.Subheader>
        </Header>

        <List horizontal>
          <List.Item>
            <List.Content>
              <DatePicker
                maxDate={this.state.toDate}
                placeholder="From Date"
                handleDateChange={this.handleFromDateChange}
              />
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <DatePicker
                minDate={this.state.fromDate}
                placeholder="To Date"
                handleDateChange={this.handleToDateChange}
              />
            </List.Content>
          </List.Item>
        </List>
      </>
    );
  }

  renderHeader = () => {
    return (
      <Grid columns={2}>
        <Grid.Column>
          <Header as="h3">
            Most Loaned Documents
            <Header.Subheader>{this.subtitle}</Header.Subheader>
          </Header>
        </Grid.Column>
        <Grid.Column textAlign={'right'}>
          <ExportSearchResults
            onExportClick={(format, size) => {
              // build params
              const params = circulationStatsApi.getMostLoanedDocumentsParams(
                this.state.fromDate,
                this.state.toDate,
                size,
                format
              );
              const args = Qs.stringify(params);
              // build final url
              const exportUrl = `${circulationStatsApi.mostLoanedUrl}?${args}`;
              // open in a new tab
              window.open(exportUrl, '_blank');
            }}
          />
        </Grid.Column>
      </Grid>
    );
  };

  createLoansUrl = (hit, fromDate, toDate) => {
    const query = loanApi
      .query()
      .withDocPid(hit.metadata.pid)
      .withStartDate({ fromDate, toDate })
      .withState(
        invenioConfig.circulation.loanActiveStates.concat(
          invenioConfig.circulation.loanCompletedStates
        )
      )
      .qs();
    return BackOfficeRoutes.loansListWithQuery(query);
  };

  renderListEntryElement = document => {
    return (
      <DocumentListEntry
        document={document}
        renderMiddleColumn={doc => <DocumentStats metadata={doc.metadata} />}
      />
    );
  };

  render() {
    const { data, isLoading, error } = this.props;
    const hitsWithLinks = data.hits.map(hit => {
      hit.metadata.loan_count_url = this.createLoansUrl(
        hit,
        this.state.fromDate,
        this.state.toDate
      );
      return hit;
    });
    return (
      <Grid columns={1}>
        <Grid.Column>{this.renderDateRangePicker()}</Grid.Column>
        <Grid.Column>{this.renderHeader()}</Grid.Column>
        <Grid.Column>
          <Loader isLoading={isLoading}>
            <Error error={error}>
              <DocumentList
                hits={hitsWithLinks}
                renderListEntryElement={this.renderListEntryElement}
              />
            </Error>
          </Loader>
        </Grid.Column>
      </Grid>
    );
  }
}

MostLoanedDocumentsList.propTypes = {
  fetchMostLoanedDocuments: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
