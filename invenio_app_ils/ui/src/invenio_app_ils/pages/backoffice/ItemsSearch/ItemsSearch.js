import React, { Component } from 'react';
import { Grid, Segment, Icon, Header } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  EmptyResults,
  Error,
  Pagination,
  Count,
  Aggregator,
  InvenioSearchApi,
} from 'react-searchkit';
import { getSearchConfig } from '../../../common/config';
import {
  Error as IlsError,
  SearchBar as ItemsSearchBar,
  ResultsSort,
  ResultsTable,
  formatter,
} from '../../../common/components';
import { item as itemApi } from '../../../common/api';
import { ExportReactSearchKitResults } from '../components';
import { ClearButton, NewButton } from '../components/buttons';
import { BackOfficeRoutes } from '../../../routes/urls';
import _omit from 'lodash/omit';

export class ItemsSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: itemApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('items');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <ItemsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for items'}
      />
    );
  };

  prepareData(data) {
    return data.map(row => {
      return _omit(formatter.item.toTable(row), [
        'Created',
        'Updated',
        'Document ID',
        'Internal location',
        'Location',
        'Shelf',
      ]);
    });
  }

  renderResultsTable = results => {
    const rows = this.prepareData(results);
    const maxRowsToShow =
      rows.length > ResultsTable.defaultProps.showMaxRows
        ? rows.length
        : ResultsTable.defaultProps.showMaxRows;
    const headerActionComponent = (
      <div>
        <NewButton text={'New item'} url={BackOfficeRoutes.itemsCreate} />
        <ExportReactSearchKitResults exportBaseUrl={itemApi.searchBaseURL} />
      </div>
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        name={'items'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={BackOfficeRoutes.itemDetailsFor}
        showMaxRows={maxRowsToShow}
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
          <NewButton text={'New item'} url={BackOfficeRoutes.itemsCreate} />
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

  renderAggregations = () => {
    const components = this.searchConfig.AGGREGATIONS.map(agg => (
      <div key={agg.field}>
        <Aggregator title={agg.title} field={agg.field} />
      </div>
    ));
    return <div>{components}</div>;
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
