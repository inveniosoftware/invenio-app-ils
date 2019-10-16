import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Qs from 'qs';
import {
  Loader,
  Error,
  ResultsTable,
  formatter,
} from '../../../../../common/components';
import pick from 'lodash/pick';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { Grid, Segment, Icon, Header } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import { stats as statsApi } from '../../../../../common/api';
import { ExportSearchResults } from '../../../components';

export default class MostLoanedDocumentsList extends Component {
  constructor(props) {
    super(props);
    this.fetchMostLoanedDocuments = props.fetchMostLoanedDocuments;
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
    this.fetchMostLoanedDocuments(this.state.fromDate, this.state.toDate);
  }

  prepareData(data) {
    const { fromDate, toDate } = this.state;
    return data.hits.map(row => {
      return pick(formatter.mostLoanedDocument.toTable(row, fromDate, toDate), [
        'ID',
        'Title',
        'Loan Count',
        'Extension Count',
      ]);
    });
  }

  handleDateChange = (event, { name, value }) => {
    const fromDate = name === 'fromDate' ? value : this.state.fromDate;
    const toDate = name === 'toDate' ? value : this.state.toDate;
    this.setState({ [name]: value });
    this.fetchMostLoanedDocuments(fromDate, toDate);
  };

  renderDateRangePicker() {
    return (
      <Segment.Group>
        <Segment>
          <Header
            as="h3"
            content="Pick range of dates"
            subheader="Choose between which dates to search the most loaned documents"
          />
        </Segment>
        <Segment.Group horizontal>
          <Segment>
            <DateInput
              autoComplete="off"
              clearable
              clearIcon={<Icon name="remove" color="red" />}
              closable
              dateFormat="YYYY-MM-DD"
              iconPosition="left"
              maxDate={this.state.toDate}
              name="fromDate"
              onChange={this.handleDateChange}
              placeholder="Start Date"
              value={this.state.fromDate}
            />
          </Segment>
          <Segment>
            <DateInput
              autoComplete="off"
              clearable
              clearIcon={<Icon name="remove" color="red" />}
              closable
              dateFormat="YYYY-MM-DD"
              iconPosition="left"
              minDate={this.state.fromDate}
              name="toDate"
              onChange={this.handleDateChange}
              placeholder="End Date"
              value={this.state.toDate}
            />
          </Segment>
        </Segment.Group>
      </Segment.Group>
    );
  }

  renderTable(data) {
    const rows = this.prepareData(data);
    rows.totalHits = data.total;
    const headerActionComponent = (
      <ExportSearchResults
        onExportClick={(format, size) => {
          // build params
          const params = statsApi.getMostLoanedDocumentsParams(
            this.state.fromDate,
            this.state.toDate,
            size,
            format
          );
          const args = Qs.stringify(params);
          // build final url
          const exportUrl = `${statsApi.mostLoanedUrl}?${args}`;
          // open in a new tab
          window.open(exportUrl, '_blank');
        }}
      ></ExportSearchResults>
    );

    return (
      <ResultsTable
        rows={rows}
        title={'Most Loaned Documents'}
        subtitle={this.subtitle}
        name={'most loaned documents during this time period'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={BackOfficeRoutes.documentDetailsFor}
        showMaxRows={this.props.showMaxDocuments}
      />
    );
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>{this.renderDateRangePicker()}</Grid.Column>
          <Grid.Column width={12}>
            <Loader isLoading={isLoading}>
              <Error error={error}>{this.renderTable(data)}</Error>
            </Loader>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

MostLoanedDocumentsList.propTypes = {
  fetchMostLoanedDocuments: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxDocuments: PropTypes.number,
};

MostLoanedDocumentsList.defaultProps = {
  showMaxDocuments: 30,
};
