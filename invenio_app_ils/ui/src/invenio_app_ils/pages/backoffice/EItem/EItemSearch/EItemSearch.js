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
import { getSearchConfig } from '../../../../common/config';
import {
  Error as IlsError,
  SearchBar as EItemsSearchBar,
  ResultsSort,
  ResultsTable,
} from '../../../../common/components';
import { eitem as eitemApi } from '../../../../common/api';
import { ExportReactSearchKitResults } from '../../components';
import { ClearButton, NewButton } from '../../components/buttons';
import { BackOfficeRoutes } from '../../../../routes/urls';
import history from '../../../../history';

export class EItemSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: eitemApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('eitems');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <EItemsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for eitems'}
      />
    );
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.eitemDetailsFor(row.metadata.pid)}
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
      <div>
        <NewButton text={'New eitem'} to={BackOfficeRoutes.eitemCreate} />
        <ExportReactSearchKitResults exportBaseUrl={eitemApi.searchBaseURL} />
      </div>
    );

    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      {
        title: 'Open Access',
        field: 'metadata.open_access',
        formatter: ({ row }) => (row.metadata.open_access ? 'Yes' : 'No'),
      },
      { title: 'Title', field: 'metadata.document.title' },
      { title: 'Description', field: 'metadata.description' },
    ];

    return (
      <ResultsTable
        data={results}
        columns={columns}
        title={''}
        name={'eitems'}
        headerActionComponent={headerActionComponent}
        showMaxRows={maxRowsToShow}
      />
    );
  };

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No eitems found!
        </Header>
        <div>Current search "{queryString}"</div>
        <Segment.Inline>
          <ClearButton clickHandler={resetQuery} />
          <NewButton text={'New eitem'} to={BackOfficeRoutes.eitemCreate} />
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
