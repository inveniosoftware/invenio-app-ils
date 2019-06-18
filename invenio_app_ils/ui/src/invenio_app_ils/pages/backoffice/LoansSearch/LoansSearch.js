import React, { Component } from 'react';
import {
  Container,
  Grid,
  Segment,
  Icon,
  Header,
  Button,
} from 'semantic-ui-react';
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
  Aggregator,
} from 'react-searchkit';
import { apiConfig } from '../../../common/api/base';
import { Error as IlsError } from '../../../common/components';
import { loan as endpoint } from '../../../common/api/loans/loan';
import { SearchBar as LoansSearchBar } from '../../../common/components';
import { ResultsList as LoansResultsList } from './components';
import './LoansSearch.scss';
import { default as config } from './config';
import { BackOfficeRoutes } from '../../../routes/urls';
import { goTo } from '../../../history';

export class LoansSearch extends Component {
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

  renderResultsList = results => {
    return (
      <div className="results-list">
        <LoansResultsList
          results={results}
          viewDetailsClickHandler={row =>
            goTo(BackOfficeRoutes.loanDetailsFor(row.ID))
          }
        />
      </div>
    );
  };

  renderAggregations = () => {
    const components = config.AGGREGATIONS.map(agg => (
      <div className="aggregator" key={agg.field}>
        <Aggregator title={agg.title} field={agg.field} />
      </div>
    ));
    return <div className="aggregators">{components}</div>;
  };

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No loans found!
        </Header>
        <div className="empty-results-current">
          Current search "{queryString}"
        </div>
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

  renderPagination = () => {
    return <Pagination />;
  };

  renderCount = totalResults => {
    return <div>{totalResults} results</div>;
  };

  renderResultsSorting = () => {
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

  renderHeader = () => {
    return (
      <Grid columns={3} verticalAlign="middle" relaxed>
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
      <Grid columns={3} verticalAlign="middle" relaxed>
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
          url: endpoint.url,
        }}
      >
        <Container className="loans-search-searchbar">
          <SearchBar renderElement={this.renderSearchBar} />
        </Container>

        <Grid columns={2} stackable relaxed className="loans-search-container">
          <Grid.Column width={3}>{this.renderAggregations()}</Grid.Column>
          <Grid.Column width={13} textAlign="center">
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
