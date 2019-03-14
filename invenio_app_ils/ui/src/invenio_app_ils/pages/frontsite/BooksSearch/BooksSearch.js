import React, { Component } from 'react';
import { generatePath } from 'react-router';
import {
  Container,
  Grid,
  Segment,
  Icon,
  Header,
  Responsive,
  Accordion,
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
import { FrontSiteURLS } from '../../../common/urls';
import { Error as IlsError } from '../../../common/components';
import { document as documentApi } from '../../../common/api';
import { SearchBar as BooksSearchBar } from '../../../common/components';
import { ResultsList as BooksResultsList } from './components';
import { default as config } from './config';
import './BooksSearch.scss';

export class BooksSearch extends Component {
  state = { activeIndex: 0 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  _renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <BooksSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for books...'}
      />
    );
  };

  _renderResultsList = results => {
    return (
      <div className="results-list">
        <BooksResultsList
          results={results}
          viewDetailsClickHandler={documentPid => {
            const path = generatePath(FrontSiteURLS.bookDetails, {
              documentPid: documentPid,
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
          No books found!
        </Header>
        <div className="empty-results-current">
          Current search "{queryString}"
        </div>
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
        <span className="before">Show </span>
        <ResultsPerPage
          values={config.RESULTS_PER_PAGE}
          defaultValue={config.RESULTS_PER_PAGE[0].value}
        />
        <span className="middle"> results per page sorted by</span>
        <br />
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

  _renderAggregations = () => {
    const { activeIndex } = this.state;

    const panels = config.AGGREGATIONS.map((agg, index) => (
      <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === index}
          index={index}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          {agg.title}
        </Accordion.Title>

        <Accordion.Content active={activeIndex === index}>
          <Aggregator field={agg.field} />
        </Accordion.Content>
      </Accordion>
    ));
    return <div>{panels}</div>;
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
          url: documentApi.url,
        }}
      >
        <Container className="books-search-searchbar">
          <SearchBar renderElement={this._renderSearchBar} />
        </Container>

        <Grid columns={2} stackable relaxed className="books-search-container">
          <Grid.Column width={3}>{this._renderAggregations()}</Grid.Column>
          <Grid.Column width={13}>
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
