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
  InvenioSearchApi,
} from 'react-searchkit';
import { getSearchConfig } from '../../../../common/config';
import {
  Error as IlsError,
  SearchBar as EItemsSearchBar,
  ResultsSort,
  ResultsTable,
} from '../../../../common/components';
import { formatter } from '../../../../common/components/ResultsTable/formatters';
import { eitem as eitemApi } from '../../../../common/api';
import { ExportReactSearchKitResults } from '../../components';
import { ClearButton, NewButton } from '../../components/buttons';
import { BackOfficeRoutes } from '../../../../routes/urls';
import { goTo, goToHandler } from '../../../../history';
import _omit from 'lodash/omit';

export class EItemSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: eitemApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('eitems');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <EItemsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for eitems'}
      />
    );
  };

  prepareData(data) {
    return data.map(row => {
      return _omit(formatter.eitem.toTable(row), [
        'Created',
        'Updated',
        'Document ID',
        'Internal Notes',
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
      <div>
        <NewButton
          text={'New eitem'}
          clickHandler={goToHandler(BackOfficeRoutes.eitemCreate)}
        />
        <ExportReactSearchKitResults exportBaseUrl={eitemApi.searchBaseURL} />
      </div>
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        name={'eitems'}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={row =>
          goTo(BackOfficeRoutes.eitemDetailsFor(row.ID))
        }
        showMaxRows={maxRowsToShow}
      />
    );
  };

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No eitems found!
        </Header>
        <div>Current search "{queryString}"</div>
        <Segment.Inline>
          <ClearButton
            clickHandler={() => {
              resetQuery();
            }}
          />
          <NewButton
            text={'New eitem'}
            clickHandler={goToHandler(BackOfficeRoutes.eitemCreate)}
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

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi}>
        <Grid>
          <Grid.Row columns={1}>
            <Grid.Column>
              <SearchBar renderElement={this.renderSearchBar} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={1}>
            <ResultsLoader>
              <Grid.Column>
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
