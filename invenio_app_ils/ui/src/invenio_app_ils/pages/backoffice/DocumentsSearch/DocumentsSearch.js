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
  Aggregator,
} from 'react-searchkit';
import { apiConfig } from '../../../common/api/base';
import {
  Error as IlsError,
  SearchBar as DocumentsSearchBar,
} from '../../../common/components';
import { document as documentApi } from '../../../common/api/documents/document';
import { ClearButton, NewButton } from '../components/buttons';
import { BackOfficeRoutes, openRecordEditor } from '../../../routes/urls';
import { ResultsList as DocumentsResultsList } from './components';
import { default as config } from './config';
import { goTo } from '../../../history';
import './DocumentsSearch.scss';

export class DocumentsSearch extends Component {
  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
      {
        name: 'author',
        field: 'authors.full_name',
        defaultValue: '"Doe, John"',
      },
      {
        name: 'created',
        field: '_created',
      },
    ];
    return (
      <DocumentsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for documents'}
        queryHelperFields={helperFields}
      />
    );
  };

  renderResultsList = results => {
    return (
      <div className="results-list">
        <DocumentsResultsList
          results={results}
          viewDetailsClickHandler={row =>
            goTo(BackOfficeRoutes.documentDetailsFor(row.ID))
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
          No documents found!
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
            text={'New document'}
            clickHandler={() => {
              openRecordEditor(documentApi.url);
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

  renderAggregations = () => {
    const components = config.AGGREGATIONS.map(agg => (
      <div className="aggregator" key={agg.field}>
        <Aggregator title={agg.title} field={agg.field} />
      </div>
    ));
    return <div className="aggregators">{components}</div>;
  };

  render() {
    return (
      <ReactSearchKit
        searchConfig={{
          ...apiConfig,
          url: documentApi.url,
        }}
      >
        <Container className="documents-search-searchbar">
          <SearchBar renderElement={this.renderSearchBar} />
        </Container>

        <Grid
          columns={2}
          stackable
          relaxed
          className="documents-search-container"
        >
          <Grid.Column width={3}>{this.renderAggregations()}</Grid.Column>
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
