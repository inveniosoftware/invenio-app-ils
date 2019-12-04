import {
  SearchAggregationsCards,
  SearchControls,
  SearchEmptyResults,
  SearchFooter,
} from '@components/SearchControls';
import SeriesList from './SeriesList';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Header, Container } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  Error,
  InvenioSearchApi,
} from 'react-searchkit';
import {
  Error as IlsError,
  SearchBar as SeriesSearchBar,
  ResultsTable,
} from '@components';
import { series as seriesApi } from '@api/series/series';
import { responseRejectInterceptor } from '@api/base';
import { getSearchConfig } from '@config';
import { ExportReactSearchKitResults } from '../../components';
import { NewButton } from '../../components/buttons';
import { BackOfficeRoutes } from '@routes/urls';
import history from '@history';

export class SeriesSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: seriesApi.searchBaseURL,
    withCredentials: true,
    interceptors: {
      response: { reject: responseRejectInterceptor },
    },
  });
  searchConfig = getSearchConfig('series');

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
      <SeriesSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for series'}
        queryHelperFields={helperFields}
      />
    );
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.seriesDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderResultsTable = results => {
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Mode Of Issuance', field: 'metadata.mode_of_issuance' },
      { title: 'Title', field: 'metadata.title' },
      { title: 'Authors', field: 'metadata.authors' },
    ];

    return (
      <ResultsTable
        data={results}
        columns={columns}
        title={''}
        name={'series'}
      />
    );
  };

  renderSeriesList = results => {
    return <SeriesList hits={results} />;
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  render() {
    return (
      <>
        <Header as="h2">Series</Header>
        <ReactSearchKit searchApi={this.searchApi} history={history}>
          <Container fluid className="spaced">
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
          <Grid>
            <Grid.Row columns={2}>
              <ResultsLoader>
                <Grid.Column width={3} className={'search-aggregations'}>
                  <Header content={'Filter by'} />
                  <SearchAggregationsCards modelName={'series'} />
                </Grid.Column>
                <Grid.Column width={13}>
                  <Grid columns={2}>
                    <Grid.Column width={8}>
                      <NewButton
                        text={'New series'}
                        to={BackOfficeRoutes.seriesCreate}
                      />
                    </Grid.Column>
                    <Grid.Column width={8} textAlign={'right'}>
                      <ExportReactSearchKitResults
                        exportBaseUrl={seriesApi.searchBaseURL}
                      />
                    </Grid.Column>
                  </Grid>
                  <SearchEmptyResults extras={this.renderEmptyResultsExtra} />
                  <Error renderElement={this.renderError} />
                  <SearchControls modelName={'series'} />
                  <ResultsList renderElement={this.renderSeriesList} />
                  <SearchFooter />
                </Grid.Column>
              </ResultsLoader>
            </Grid.Row>
          </Grid>
        </ReactSearchKit>
      </>
    );
  }
}
