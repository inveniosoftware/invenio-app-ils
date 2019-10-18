import React, { Component } from 'react';
import { Grid, Item, Segment, Icon, Header } from 'semantic-ui-react';
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
} from '../../../common/components';
import { item as itemApi } from '../../../common/api';
import { ExportReactSearchKitResults, ItemListEntry } from '../components';
import { ClearButton, NewButton } from '../components/buttons';
import { BackOfficeRoutes } from '../../../routes/urls';

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

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No items found!
        </Header>
        <div>Current search "{queryString}"</div>
        <Segment.Inline>
          <ClearButton
            clickHandler={() => {
              resetQuery();
            }}
          />
          <NewButton text={'New item'} to={BackOfficeRoutes.itemCreate} />
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
    return (
      <>
        <NewButton fluid text={'New item'} to={BackOfficeRoutes.itemCreate} />
        {components}
      </>
    );
  };

  renderHeader = () => {
    return (
      <Grid columns={2}>
        <Grid.Column>
          <Count renderElement={this.renderCount} />
        </Grid.Column>
        <Grid.Column textAlign="right">
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
        <Grid.Column width={5} textAlign="right">
          <ExportReactSearchKitResults exportBaseUrl={itemApi.searchBaseURL} />
        </Grid.Column>
      </Grid>
    );
  };

  renderItemList = results => {
    const entries = results.map(res => (
      <ItemListEntry item={res} key={res.id} />
    ));
    return <Item.Group>{entries}</Item.Group>;
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
                <ResultsList renderElement={this.renderItemList} />
                {this.renderFooter()}
              </Grid.Column>
            </ResultsLoader>
          </Grid.Row>
        </Grid>
      </ReactSearchKit>
    );
  }
}
