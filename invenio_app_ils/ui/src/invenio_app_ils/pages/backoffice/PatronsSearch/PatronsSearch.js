import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Segment, Icon, Header } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  EmptyResults,
  Error,
  Pagination,
  Count,
  InvenioSearchApi,
} from 'react-searchkit';
import { BackOfficeRoutes } from '../../../routes/urls';
import {
  Error as IlsError,
  SearchBar as PatronsSearchBar,
  ResultsSort,
  ResultsTable,
} from '../../../common/components';
import { patron as patronApi } from '../../../common/api';
import { getSearchConfig } from '../../../common/config';
import { ClearButton } from '../components/buttons';
import { ExportReactSearchKitResults } from '../components';

export class PatronsSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: patronApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('patrons');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <PatronsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for patrons'}
      />
    );
  };

  viewDetails = ({ row }) => {
    // NOTE: patrons have id in their metadata not pid.
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.patronDetailsFor(row.metadata.id)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderResultsTable = results => {
    const headerActionComponent = (
      <ExportReactSearchKitResults exportBaseUrl={patronApi.searchBaseURL} />
    );

    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.id' },
      { title: 'Name', field: 'metadata.name' },
      { title: 'Email', field: 'metadata.email' },
    ];

    return (
      <ResultsTable
        data={results}
        columns={columns}
        title={''}
        headerActionComponent={headerActionComponent}
      />
    );
  };

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No items found!
        </Header>
        <div>Current search "{queryString}"</div>
        <Segment.Inline>
          <ClearButton clickHandler={resetQuery} />
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
      <ReactSearchKit searchApi={this.searchApi}>
        <Grid>
          <Grid.Row columns={1}>
            <Grid.Column>
              <SearchBar renderElement={this.renderSearchBar} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={1}>
            <ResultsLoader>
              <Grid.Column>
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
