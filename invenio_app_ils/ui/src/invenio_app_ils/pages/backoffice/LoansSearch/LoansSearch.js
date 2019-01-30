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
import {
  SearchBar as LoansSearchBar,
  ResultsList as LoansResultsList,
} from './components';
import './LoansSearch.scss';
import { default as config } from './config';
import { viewLoanDetailsUrl } from '../../../common/urls';

export class LoansSearch extends Component {
  _renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <LoansSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
      />
    );
  };

  _renderResultsList = results => {
    return (
      <div className="results-list">
        <LoansResultsList
          results={results}
          viewDetailsClickHandler={loanPid => {
            const path = viewLoanDetailsUrl(loanPid);
            this.props.history.push(path);
          }}
        />
      </div>
    );
  };

  _renderAggregations = () => {
    const components = config.AGGREGATIONS.map(agg => (
      <div className="aggregator" key={agg.field}>
        <Aggregator title={agg.title} field={agg.field} />
      </div>
    ));
    return <div className="aggregators">{components}</div>;
  };

  _renderEmptyResults = (queryString, resetQuery) => {
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
          <Button primary onClick={() => resetQuery()}>
            Clear query
          </Button>
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
      <Grid columns={3} verticalAlign="middle" relaxed>
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
      <Grid columns={3} verticalAlign="middle" relaxed>
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
          url: endpoint.url,
        }}
      >
        <Container className="loans-search-searchbar">
          <SearchBar renderElement={this._renderSearchBar} />
        </Container>

        <Grid columns={2} stackable relaxed className="loans-search-container">
          <Grid.Column width={3}>{this._renderAggregations()}</Grid.Column>
          <Grid.Column width={13} textAlign="center">
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
