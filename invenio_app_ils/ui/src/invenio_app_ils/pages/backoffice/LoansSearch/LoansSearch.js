import React, { Component } from 'react';
import { generatePath } from 'react-router';
import {
  Container,
  Grid,
  Segment,
  Icon,
  Header,
  Button,
  Dropdown,
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
} from 'react-searchkit';
import { apiConfig } from '../../../common/api/base';
import { BackOfficeURLS } from '../../../common/urls';
import { Error as IlsError } from '../../../common/components';
import { loan as endpoint } from '../../../common/api/loan';
import {
  SearchBar as LoansSearchBar,
  ResultsList as LoansResultsList,
} from './components';
import './LoansSearch.scss';

const resultsPerPageValues = [
  {
    text: '10',
    value: 10,
  },
  {
    text: '20',
    value: 20,
  },
  {
    text: '50',
    value: 50,
  },
];

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
            const path = generatePath(BackOfficeURLS.loanDetails, {
              loanPid: loanPid,
            });
            this.props.history.push(path);
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

  _renderResultsPerPage = (currentSize, values, onChange) => {
    return (
      <div>
        <span className="results-per-page">Show</span>
        <Dropdown
          inline
          compact
          options={values}
          value={currentSize}
          onChange={(e, { value }) => onChange(value)}
        />
        <span className="results-per-page">results per page</span>
      </div>
    );
  };

  _renderHeader = () => {
    return (
      <Grid columns={3} verticalAlign="middle" relaxed>
        <Grid.Column width={4} textAlign="left">
          <Count renderElement={this._renderCount} />
        </Grid.Column>
        <Grid.Column width={8}>{this._renderPagination()}</Grid.Column>
        <Grid.Column width={4} textAlign="right">
          <ResultsPerPage
            values={resultsPerPageValues}
            defaultValue={resultsPerPageValues[0].value}
            renderElement={this._renderResultsPerPage}
          />
        </Grid.Column>
      </Grid>
    );
  };

  _renderFooter = () => {
    return (
      <Grid columns={3} verticalAlign="middle" relaxed>
        <Grid.Column width={4} />
        <Grid.Column width={8}>{this._renderPagination()}</Grid.Column>
        <Grid.Column width={4} />
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

        <Grid columns={2} relaxed className="loans-search-container">
          <Grid.Column width={4} textAlign="center">
            FACETS
          </Grid.Column>
          <Grid.Column width={12} textAlign="center">
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
