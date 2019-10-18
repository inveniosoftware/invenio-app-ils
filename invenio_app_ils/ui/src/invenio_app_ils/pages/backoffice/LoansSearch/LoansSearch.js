import React, { Component } from 'react';
import { Grid, Segment, Icon, Header, Button } from 'semantic-ui-react';
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
import { getSearchConfig } from '../../../common/config';
import {
  Error as IlsError,
  SearchBar as LoansSearchBar,
  ResultsSort,
  ResultsTable,
} from '../../../common/components';
import { formatter } from '../../../common/components/ResultsTable/formatters';
import {
  ExportReactSearchKitResults,
  OverdueLoanSendMailModal,
} from '../components';
import { loan as loanApi } from '../../../common/api/loans/loan';
import { BackOfficeRoutes } from '../../../routes/urls';
import { goTo } from '../../../history';
import _pick from 'lodash/pick';

export class LoansSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: loanApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('loans');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <LoansSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for loans'}
      />
    );
  };

  prepareData(data) {
    return data.map(row => {
      const actions = row.metadata.is_overdue && (
        <OverdueLoanSendMailModal loan={row} />
      );
      return _pick(formatter.loan.toTable(row, actions), [
        'ID',
        'Document ID',
        'Patron',
        'State',
        'Request start date',
        'End date',
        'Renewals',
        'Actions',
      ]);
    });
  }

  renderResultsTable = results => {
    const rows = this.prepareData(results);
    const maxRowsToShow =
      rows.length > ResultsTable.defaultProps.showMaxRows
        ? rows.length
        : ResultsTable.defaultProps.showMaxRows;

    const headerActionComponent = (
      <ExportReactSearchKitResults exportBaseUrl={loanApi.searchBaseURL} />
    );

    return (
      <ResultsTable
        rows={rows}
        name={'loans'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={row =>
          goTo(BackOfficeRoutes.loanDetailsFor(row.ID))
        }
        showMaxRows={maxRowsToShow}
      />
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

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No loans found!
        </Header>
        <div>Current search "{queryString}"</div>
        <Segment.Inline>
          <Button primary onClick={() => resetQuery()}>
            Clear query
          </Button>
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
