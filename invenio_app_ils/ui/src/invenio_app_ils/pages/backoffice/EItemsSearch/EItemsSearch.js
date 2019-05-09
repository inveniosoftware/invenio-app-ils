import React, { Component } from 'react';
import { Container, Grid, Segment, Icon, Header } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  ResultsPerPage,
  EmptyResults,
  Error,
  Pagination,
  Count,
  SortBy,
  SortOrder,
} from 'react-searchkit';
import { apiConfig } from '../../../common/api/base';
import { Error as IlsError } from '../../../common/components';
import { eitem as eitemApi } from '../../../common/api';
import { ClearButton, NewButton } from '../components/buttons';
import { BackOfficeRoutes, openRecordEditor } from '../../../routes/urls';
import { SearchBar as EItemsSearchBar } from '../../../common/components';
import { ResultsList as EItemsResultsList } from './components';
import { default as config } from './config';
import './EItemsSearch.scss';

export class EItemsSearch extends Component {
  _renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <EItemsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for eitems'}
      />
    );
  };

  _renderResultsList = results => {
    return (
      <div className="results-list">
        <EItemsResultsList
          results={results}
          viewDetailsClickHandler={eitemPid => {
            this.props.history.push(BackOfficeRoutes.eitemDetailsFor(eitemPid));
          }}
        />
      </div>
    );
  };

  _renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No eitems found!
        </Header>
        <div className="empty-results-current">
          Current search "{queryString}"
        </div>
        <Segment.Inline>
          <ClearButton
            clickHandler={() => {
              resetQuery();
            }}
          />
          <NewButton
            text={'New eitem'}
            clickHandler={() => {
              openRecordEditor(eitemApi.url);
            }}
          />
        </Segment.Inline>
      </Segment>
    );
  };

  _renderError = error => {
    return <IlsError error={error} />;
  };

  _renderPagination = () => {
    return <Pagination />;
  };

  _renderCount = totalResults => {
    return <div>{totalResults} results</div>;
  };

  _renderResultsSorting = () => {
    return config.SORT_BY.length ? (
      <div className="sorting">
        <span className="before">Show</span>
        <ResultsPerPage
          values={config.RESULTS_PER_PAGE}
          defaultValue={config.RESULTS_PER_PAGE[0].value}
        />
        <span className="middle">results per page sorted by</span>
        <SortBy
          values={config.SORT_BY}
          defaultValue={config.SORT_BY[0].value}
          defaultValueOnEmptyString={config.SORT_BY_ON_EMPTY_QUERY}
        />
        <SortOrder
          values={config.SORT_ORDER}
          defaultValue={config.SORT_ORDER[0]['value']}
        />
      </div>
    ) : null;
  };

  _renderHeader = () => {
    return (
      <Grid columns={3} verticalAlign="middle" stackable relaxed>
        <Grid.Column width={5} textAlign="left">
          <Count renderElement={this._renderCount} />
        </Grid.Column>
        <Grid.Column width={6}>{this._renderPagination()}</Grid.Column>
        <Grid.Column width={5} textAlign="right">
          {this._renderResultsSorting()}
        </Grid.Column>
      </Grid>
    );
  };

  _renderFooter = () => {
    return (
      <Grid columns={3} verticalAlign="middle" stackable relaxed>
        <Grid.Column width={5} />
        <Grid.Column width={6}>{this._renderPagination()}</Grid.Column>
        <Grid.Column width={5} />
      </Grid>
    );
  };

  render() {
    return (
      <ReactSearchKit
        searchConfig={{
          ...apiConfig,
          url: eitemApi.url,
        }}
      >
        <Container className="eitems-search-searchbar">
          <SearchBar renderElement={this._renderSearchBar} />
        </Container>

        <Grid columns={2} stackable relaxed className="eitems-search-container">
          <Grid.Column width={16}>
            <ResultsLoader>
              <EmptyResults renderElement={this._renderEmptyResults} />
              <Error renderElement={this._renderError} />
              {this._renderHeader()}
              <ResultsList renderElement={this._renderResultsList} />
              {this._renderFooter()}
            </ResultsLoader>
          </Grid.Column>
        </Grid>
      </ReactSearchKit>
    );
  }
}
