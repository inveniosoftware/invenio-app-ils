import React, { Component } from 'react';
import { Container, Grid, Segment, Icon, Header } from 'semantic-ui-react';
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
import {
  Error as IlsError,
  SearchBar as SeriesSearchBar,
  ResultsSort,
} from '../../../../common/components';
import { series as seriesApi } from '../../../../common/api/series/series';
import { getSearchConfig } from '../../../../common/config';
import { ClearButton, NewButton } from '../../components/buttons';
import { BackOfficeRoutes } from '../../../../routes/urls';
import { ResultsList as SeriesResultsList } from './components';
import { goTo } from '../../../../history';
import './SeriesSearch.scss';

export class SeriesSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: seriesApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('series');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
      {
        name: 'mode of issuance',
        field: 'mode_of_issuance',
        defaultValue: 'SERIAL',
      },
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
      <SeriesSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for series'}
        queryHelperFields={helperFields}
      />
    );
  };

  renderResultsList = results => {
    return (
      <div className="results-list">
        <SeriesResultsList
          results={results}
          viewDetailsClickHandler={row =>
            goTo(BackOfficeRoutes.seriesDetailsFor(row.ID))
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
          No series found!
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
            text={'New series'}
            clickHandler={() => {
              goTo(BackOfficeRoutes.seriesCreate);
            }}
          />
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
      <Grid columns={3} verticalAlign="middle" stackable relaxed>
        <Grid.Column width={5} textAlign="left">
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
      <Grid columns={3} verticalAlign="middle" stackable relaxed>
        <Grid.Column width={5} />
        <Grid.Column width={6}>
          <Pagination />
        </Grid.Column>
        <Grid.Column width={5} />
      </Grid>
    );
  };

  renderAggregations = () => {
    const components = this.searchConfig.AGGREGATIONS.map(agg => (
      <div className="aggregator" key={agg.field}>
        <Aggregator title={agg.title} field={agg.field} />
      </div>
    ));
    return <div className="aggregators">{components}</div>;
  };

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi}>
        <Container className="series-search-searchbar">
          <SearchBar renderElement={this.renderSearchBar} />
        </Container>

        <Grid columns={2} stackable relaxed className="series-search-container">
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
