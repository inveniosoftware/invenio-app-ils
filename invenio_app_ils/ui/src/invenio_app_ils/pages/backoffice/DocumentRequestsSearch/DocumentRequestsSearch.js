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
  SearchBar as DocumentRequestsSearchBar,
  ResultsSort,
  ResultsTable,
  formatter,
} from '../../../common/components';
import { documentRequest as documentRequestApi } from '../../../common/api/documentRequests/documentRequest';
import { getSearchConfig } from '../../../common/config';
import { ClearButton, NewButton } from '../components/buttons';
import { ExportReactSearchKitResults } from '../components';
import { BackOfficeRoutes } from '../../../routes/urls';
import _pick from 'lodash/pick';

export class DocumentRequestsSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: documentRequestApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('documentRequests');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
      {
        name: 'State',
        field: 'state',
        defaultValue: 'PENDING',
      },
      {
        name: 'Document PID',
        field: 'document_pid',
        defaultValue: '1',
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

  prepareData(data) {
    return data.map(row => {
      return _pick(formatter.documentRequest.toTable(row), [
        'ID',
        'Patron ID',
        'Title',
        'State',
      ]);
    });
  }

  renderResultsTable = results => {
    const rows = this.prepareData(results);
    const headerActionComponent = (
      <div>
        <NewButton
          text={'New book request'}
          url={BackOfficeRoutes.documentRequestCreate}
        />
        <ExportReactSearchKitResults
          exportBaseUrl={documentRequestApi.searchBaseURL}
        />
      </div>
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        name={'book requests'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={BackOfficeRoutes.documentRequestDetailsFor}
      />
    );
  };

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No book requests found!
        </Header>
        <div>Current search "{queryString}"</div>
        <Segment.Inline>
          <ClearButton
            clickHandler={() => {
              resetQuery();
            }}
          />
          <NewButton
            text={'New book request'}
            url={BackOfficeRoutes.documentRequestCreate}
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

          <Grid.Row>
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
