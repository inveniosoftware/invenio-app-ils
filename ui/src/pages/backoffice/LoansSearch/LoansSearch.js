import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Segment, Icon, Header, Button } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  EmptyResults,
  Error,
  Pagination,
  Count,
  BucketAggregation,
  InvenioSearchApi,
} from 'react-searchkit';
import { getSearchConfig } from '@config';
import {
  Error as IlsError,
  SearchBar as LoansSearchBar,
  ResultsSort,
  ResultsTable,
} from '@components';
import { dateFormatter } from '@api/date';
import {
  ExportReactSearchKitResults,
  OverdueLoanSendMailModal,
} from '../components';
import { loan as loanApi } from '@api/loans/loan';
import { BackOfficeRoutes } from '@routes/urls';
import history from '@history';

export class LoansSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: loanApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('loans');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <LoansSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for loans'}
      />
    );
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.loanDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderResultsTable = results => {
    const maxRowsToShow =
      results.length > ResultsTable.defaultProps.showMaxRows
        ? results.length
        : ResultsTable.defaultProps.showMaxRows;

    const headerActionComponent = (
      <ExportReactSearchKitResults exportBaseUrl={loanApi.searchBaseURL} />
    );

    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Document ID', field: 'metadata.document_pid' },
      {
        title: 'Patron',
        field: 'metadata.patron.name',
        formatter: ({ row }) => (
          <Link to={BackOfficeRoutes.patronDetailsFor(row.metadata.patron_pid)}>
            {row.metadata.patron.name}
          </Link>
        ),
      },
      { title: 'State', field: 'metadata.state' },
      {
        title: 'Start date',
        field: 'metadata.start_date',
        formatter: dateFormatter,
      },
      {
        title: 'End date',
        field: 'metadata.end_date',
        formatter: dateFormatter,
      },
      { title: 'Renewals', field: 'metadata.extension_count' },
      {
        title: 'Actions',
        field: '',
        formatter: ({ row }) => {
          if (row.metadata.is_overdue) {
            return <OverdueLoanSendMailModal loan={row} />;
          }
          return null;
        },
      },
    ];
    return (
      <ResultsTable
        data={results}
        columns={columns}
        name={'loans'}
        totalHitsCount={results.length}
        headerActionComponent={headerActionComponent}
        showMaxRows={maxRowsToShow}
      />
    );
  };

  renderAggregations = () => {
    const components = this.searchConfig.FILTERS.map(filter => (
      <BucketAggregation
        key={filter.field}
        title={filter.title}
        agg={{ field: filter.field, aggName: filter.aggName }}
      />
    ));
    return <div>{components}</div>;
  };

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No loans found!
        </Header>
        <div>Current search "{queryString}"</div>
        <Segment.Inline>
          <Button primary onClick={() => resetQuery()}>
            Clear query
          </Button>
        </Segment.Inline>
      </Segment>
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderCount = totalResults => {
    return <div>{totalResults} results</div>;
  };

  renderHeader = () => {
    return (
      <Grid columns={3}>
        <Grid.Column width={5}>
          <Count renderElement={this.renderCount} />
        </Grid.Column>
        <Grid.Column width={6}>
          <Pagination />
        </Grid.Column>
        <Grid.Column width={5} textAlign="right">
          <ResultsSort searchConfig={this.searchConfig} />
        </Grid.Column>
      </Grid>
    );
  };

  renderFooter = () => {
    return (
      <Grid columns={3}>
        <Grid.Column width={5} />
        <Grid.Column width={6}>
          <Pagination />
        </Grid.Column>
        <Grid.Column width={5} />
      </Grid>
    );
  };

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi} history={history}>
        <Grid>
          <Grid.Row columns={1}>
            <Grid.Column>
              <SearchBar renderElement={this.renderSearchBar} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <ResultsLoader>
              <Grid.Column width={3}>{this.renderAggregations()}</Grid.Column>
              <Grid.Column width={13}>
                <EmptyResults renderElement={this.renderEmptyResults} />
                <Error renderElement={this.renderError} />
                {this.renderHeader()}
                <ResultsList renderElement={this.renderResultsTable} />
                {this.renderFooter()}
              </Grid.Column>
            </ResultsLoader>
          </Grid.Row>
        </Grid>
      </ReactSearchKit>
    );
  }
}
