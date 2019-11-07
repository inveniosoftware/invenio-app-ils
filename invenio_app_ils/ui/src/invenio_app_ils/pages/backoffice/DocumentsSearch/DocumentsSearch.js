import React, { Component } from 'react';
import { Grid, Segment, Icon, Header } from 'semantic-ui-react';
import {
  BucketAggregation,
  Count,
  EmptyResults,
  Error,
  Pagination,
  ResultsList,
  ReactSearchKit,
  ResultsLoader,
  SearchBar,
  InvenioSearchApi,
} from 'react-searchkit';
import {
  Error as IlsError,
  SearchBar as DocumentsSearchBar,
  ResultsSort,
} from '../../../common/components';
import { document as documentApi } from '../../../common/api/documents/document';
import { getSearchConfig } from '../../../common/config';
import { ClearButton, NewButton } from '../components/buttons';
import { BackOfficeRoutes } from '../../../routes/urls';
import { DocumentList, ExportReactSearchKitResults } from '../components';
import history from '../../../history';

export class DocumentsSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: documentApi.searchBaseURL,
    withCredentials: true,
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

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No documents found!
        </Header>
        <div>Current search "{queryString}"</div>
        <Segment.Inline>
          <ClearButton clickHandler={resetQuery} />
          <NewButton
            text={'New document'}
            to={BackOfficeRoutes.documentCreate}
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
      <Grid columns={2}>
        <Grid.Column>
          <Count renderElement={this.renderCount} />
        </Grid.Column>
        <Grid.Column textAlign={'right'}>
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
        <Grid.Column width={5} textAlign={'right'}>
          <ExportReactSearchKitResults
            exportBaseUrl={documentApi.searchBaseURL}
          />
        </Grid.Column>
      </Grid>
    );
  };

  renderAggregations = () => {
    const components = this.searchConfig.FILTERS.map(filter => (
      <BucketAggregation
        key={filter.field}
        title={filter.title}
        agg={{ field: filter.field, aggName: filter.aggName }}
      />
    ));
    return (
      <>
        <NewButton
          fluid
          text={'New document'}
          to={BackOfficeRoutes.documentCreate}
        />
        {components}
      </>
    );
  };

  renderDocumentList = results => {
    return <DocumentList hits={results}/>;
  };

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi} history={history}>
        <Grid>
          <Grid.Row columns={1}>
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
                <ResultsList renderElement={this.renderDocumentList} />
                {this.renderFooter()}
              </Grid.Column>
            </ResultsLoader>
          </Grid.Row>
        </Grid>
      </ReactSearchKit>
    );
  }
}
