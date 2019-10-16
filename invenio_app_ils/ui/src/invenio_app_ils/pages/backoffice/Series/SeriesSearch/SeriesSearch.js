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
import {
  Error as IlsError,
  SearchBar as SeriesSearchBar,
  ResultsSort,
  ResultsTable,
  formatter,
} from '../../../../common/components';
import { series as seriesApi } from '../../../../common/api/series/series';
import { getSearchConfig } from '../../../../common/config';
import { ExportReactSearchKitResults } from '../../components';
import { ClearButton, NewButton } from '../../components/buttons';
import { BackOfficeRoutes } from '../../../../routes/urls';
import _pick from 'lodash/pick';

import { goTo } from '../../../../history';

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

  prepareData(data) {
    return data.map(row => {
      return _pick(formatter.series.toTable(row), [
        'ID',
        'Mode of Issuance',
        'Title',
      ]);
    });
  }

  renderResultsTable = results => {
    const rows = this.prepareData(results);
    const headerActionComponent = (
      <div>
        <NewButton
          text={'New series'}
          clickHandler={() => {
            goTo(BackOfficeRoutes.seriesCreate);
          }}
        />
        <ExportReactSearchKitResults exportBaseUrl={seriesApi.searchBaseURL} />
      </div>
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        name={'series'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={BackOfficeRoutes.seriesDetailsFor}
      />
    );
  };

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No series found!
        </Header>
        <div>Current search "{queryString}"</div>
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

  renderAggregations = () => {
    const components = this.searchConfig.AGGREGATIONS.map(agg => (
      <div key={agg.field}>
        <Aggregator title={agg.title} field={agg.field} />
      </div>
    ));
    return <div>{components}</div>;
  };

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi}>
        <Grid>
          <Grid.Row>
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
