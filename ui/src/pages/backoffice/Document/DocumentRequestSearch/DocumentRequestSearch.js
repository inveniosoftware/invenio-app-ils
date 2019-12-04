import {
  SearchAggregationsCards,
  SearchControls,
  SearchEmptyResults,
  SearchFooter,
} from '@components/SearchControls';
import DocumentRequestList from './DocumentRequestList';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Header } from 'semantic-ui-react';
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
  SearchBar as DocumentRequestsSearchBar,
} from '@components';
import { documentRequest as documentRequestApi } from '@api/documentRequests/documentRequest';
import { getSearchConfig } from '@config';
import { ExportReactSearchKitResults } from '@pages/backoffice/components';
import { BackOfficeRoutes } from '@routes/urls';
import history from '@history';
import { responseRejectInterceptor } from '@api/base';

export class DocumentRequestSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: documentRequestApi.searchBaseURL,
    withCredentials: true,
    interceptors: {
      response: { reject: responseRejectInterceptor },
    },
  });
  searchConfig = getSearchConfig('documentRequests');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
      {
        name: 'document PID',
        field: 'document_pid',
        defaultValue: '1',
      },
      {
        name: 'title',
        field: 'title',
        defaultValue: 'Harry Potter',
      },
    ];
    return (
      <DocumentRequestsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for document requests'}
        queryHelperFields={helperFields}
      />
    );
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.documentRequestDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderResultsList = results => {
    return <DocumentRequestList hits={results} />;
  };

  render() {
    return (
      <>
        <Header as="h2">Literature requests</Header>

        <ReactSearchKit searchApi={this.searchApi} history={history}>
          <Container fluid className="spaced">
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
          <Grid>
            <Grid.Row columns={2}>
              <ResultsLoader>
                <Grid.Column width={3} className={'search-aggregations'}>
                  <Header content={'Filter by'} />
                  <SearchAggregationsCards modelName={'documentRequests'} />
                </Grid.Column>
                <Grid.Column width={13}>
                  <Grid columns={2}>
                    <Grid.Column width={8} />
                    <Grid.Column width={8} textAlign={'right'}>
                      <ExportReactSearchKitResults
                        exportBaseUrl={documentRequestApi.searchBaseURL}
                      />
                    </Grid.Column>
                  </Grid>
                  <SearchEmptyResults />
                  <Error renderElement={this.renderError} />
                  <SearchControls modelName={'documentRequests'} />
                  <ResultsList renderElement={this.renderResultsList} />
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
