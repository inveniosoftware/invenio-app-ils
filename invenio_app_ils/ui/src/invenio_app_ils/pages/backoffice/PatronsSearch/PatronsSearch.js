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
import { BackOfficeRoutes } from '../../../routes/urls';
import {
  Error as IlsError,
  SearchBar as PatronsSearchBar,
} from '../../../common/components';
import { patron } from '../../../common/api';
import { getSearchConfig } from '../../../common/config';
import { ClearButton } from '../components/buttons';
import { ResultsList as PatronsResultsList } from './components';
import { goTo } from '../../../history';
import './PatronsSearch.scss';

export class PatronsSearch extends Component {
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

  renderResultsList = results => {
    return (
      <div className="results-list">
        <PatronsResultsList
          results={results}
          viewDetailsClickHandler={row =>
            goTo(BackOfficeRoutes.patronDetailsFor(row.ID))
          }
        />
      </div>
    );
  };

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No items found!
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
        </Segment.Inline>
      </Segment>
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderPagination = () => {
    return <Pagination />;
  };

  renderCount = totalResults => {
    return <div>{totalResults} results</div>;
  };

  renderResultsSorting = () => {
    return this.searchConfig.SORT_BY.length ? (
      <div className="sorting">
        <span className="before">Show</span>
        <ResultsPerPage
          values={this.searchConfig.RESULTS_PER_PAGE}
          defaultValue={this.searchConfig.RESULTS_PER_PAGE[0].value}
        />
        <span className="middle">results per page sorted by</span>
        <SortBy
          values={this.searchConfig.SORT_BY}
          defaultValue={this.searchConfig.SORT_BY[0].value}
          defaultValueOnEmptyString={this.searchConfig.SORT_BY_ON_EMPTY_QUERY}
        />
        <SortOrder
          values={this.searchConfig.SORT_ORDER}
          defaultValue={this.searchConfig.SORT_ORDER[0]['value']}
        />
      </div>
    ) : null;
  };

  renderHeader = () => {
    return (
      <Grid columns={3} verticalAlign="middle" stackable relaxed>
        <Grid.Column width={5} textAlign="left">
          <Count renderElement={this.renderCount} />
        </Grid.Column>
        <Grid.Column width={6}>{this.renderPagination()}</Grid.Column>
        <Grid.Column width={5} textAlign="right">
          {this.renderResultsSorting()}
        </Grid.Column>
      </Grid>
    );
  };

  renderFooter = () => {
    return (
      <Grid columns={3} verticalAlign="middle" stackable relaxed>
        <Grid.Column width={5} />
        <Grid.Column width={6}>{this.renderPagination()}</Grid.Column>
        <Grid.Column width={5} />
      </Grid>
    );
  };

  render() {
    return (
      <ReactSearchKit
        searchConfig={{
          ...apiConfig,
          url: patron.url,
        }}
      >
        <Container className="patrons-search-searchbar">
          <SearchBar renderElement={this.renderSearchBar} />
        </Container>

        <Grid
          columns={2}
          stackable
          relaxed
          className="patrons-search-container"
        >
          <Grid.Column width={3} />
          <Grid.Column width={13}>
            <ResultsLoader>
              <EmptyResults renderElement={this.renderEmptyResults} />
              <Error renderElement={this.renderError} />
              {this.renderHeader()}
              <ResultsList renderElement={this.renderResultsList} />
              {this.renderFooter()}
            </ResultsLoader>
          </Grid.Column>
        </Grid>
      </ReactSearchKit>
    );
  }
}
