import React, { Component } from 'react';
import { Container, Grid, Header } from 'semantic-ui-react';
import {
  Error,
  ResultsList,
  ReactSearchKit,
  ResultsLoader,
  SearchBar,
  InvenioSearchApi,
} from 'react-searchkit';
import {
  Error as IlsError,
  SearchBar as DocumentsSearchBar,
  SearchControls,
} from '@components';
import { document as documentApi } from '@api/documents/document';
import { getSearchConfig } from '@config';
import { BackOfficeRoutes } from '@routes/urls';
import {
  DocumentList,
  ExportReactSearchKitResults,
  NewButton,
} from '../../components';
import {
  SearchAggregationsCards,
  SearchFooter,
  SearchEmptyResults,
} from '@components/SearchControls/components/';
import history from '@history';

export class DocumentSearch extends Component {
  searchApi = new InvenioSearchApi({
    axios: {
      url: documentApi.searchBaseURL,
      withCredentials: true,
    },
  });
  searchConfig = getSearchConfig('documents');

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
      {
        name: 'published',
        field: 'imprint.date',
      },
    ];
    return (
      <DocumentsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for documents...'}
        queryHelperFields={helperFields}
      />
    );
  };

  renderEmptyResultsExtra = () => {
    return (
      <NewButton text={'Add document'} to={BackOfficeRoutes.documentCreate} />
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderDocumentList = results => {
    return <DocumentList hits={results} />;
  };

  render() {
    return (
      <>
        <Header as="h2">Documents</Header>
        <ReactSearchKit searchApi={this.searchApi} history={history}>
          <Container fluid className="spaced">
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
          <Container fluid className="bo-search-body">
            <Grid>
              <Grid.Row columns={2}>
                <ResultsLoader>
                  <Grid.Column width={3} className={'search-aggregations'}>
                    <Header content={'Filter by'} />
                    <SearchAggregationsCards modelName={'documents'} />
                  </Grid.Column>
                  <Grid.Column width={13}>
                    <Grid columns={2}>
                      <Grid.Column width={8}>
                        <NewButton
                          text={'Add document'}
                          to={BackOfficeRoutes.documentCreate}
                        />
                      </Grid.Column>
                      <Grid.Column width={8} textAlign={'right'}>
                        <ExportReactSearchKitResults
                          exportBaseUrl={documentApi.searchBaseURL}
                        />
                      </Grid.Column>
                    </Grid>
                    <SearchEmptyResults extras={this.renderEmptyResultsExtra} />
                    <Error renderElement={this.renderError} />
                    <SearchControls
                      modelName={'documents'}
                      withLayoutSwitcher={false}
                    />
                    <ResultsList renderElement={this.renderDocumentList} />
                    <SearchFooter />
                  </Grid.Column>
                </ResultsLoader>
              </Grid.Row>
            </Grid>
          </Container>
        </ReactSearchKit>
      </>
    );
  }
}
