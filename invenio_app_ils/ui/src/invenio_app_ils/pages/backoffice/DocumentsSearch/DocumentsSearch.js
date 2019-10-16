import React, { Component } from 'react';
import { Grid, Segment, Icon, Header } from 'semantic-ui-react';
import {
  Aggregator,
  Count,
  EmptyResults,
  Error,
  Pagination,
  ReactSearchKit,
  ResultsList,
  ResultsLoader,
  SearchBar,
  InvenioSearchApi,
} from 'react-searchkit';
import {
  Error as IlsError,
  SearchBar as DocumentsSearchBar,
  ResultsSort,
  ResultsTable,
  formatter,
} from '../../../common/components';
import { document as documentApi } from '../../../common/api/documents/document';
import { getSearchConfig } from '../../../common/config';
import { ClearButton, NewButton } from '../components/buttons';
import { BackOfficeRoutes } from '../../../routes/urls';
import { ExportReactSearchKitResults } from '../components';
import _pick from 'lodash/pick';

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

  prepareData(data) {
    return data.map(row => {
      return _pick(formatter.document.toTable(row), [
        'ID',
        'Title',
        'Authors',
        'Available Items',
      ]);
    });
  }

  renderResultsTable = results => {
    const rows = this.prepareData(results);
    const headerActionComponent = (
      <div>
        <NewButton
          text={'New document'}
          url={BackOfficeRoutes.documentCreate}
        />
        <ExportReactSearchKitResults
          exportBaseUrl={documentApi.searchBaseURL}
        />
      </div>
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        name={'documents'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={BackOfficeRoutes.documentDetailsFor}
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
          <ClearButton
            clickHandler={() => {
              resetQuery();
            }}
          />
          <NewButton
            text={'New document'}
            url={BackOfficeRoutes.documentCreate}
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
