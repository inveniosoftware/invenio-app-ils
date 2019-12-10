import React, { Component } from 'react';
import { Container, Grid, Item, Header } from 'semantic-ui-react';
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
  SearchBar as BorrowingRequestSearchBar,
  SearchControls,
} from '@components';
import { borrowingRequest as borrowingRequestApi } from '@api';
import {
  ExportReactSearchKitResults,
  NewButton,
} from '@pages/backoffice/components';
import {
  SearchAggregationsCards,
  SearchFooter,
  SearchEmptyResults,
} from '@components/SearchControls/components/';
import { ILLRoutes } from '@routes/urls';
import history from '@history';
import { BorrowingRequestListEntry } from './components';

export class BorrowingRequestSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: borrowingRequestApi.searchBaseURL,
    withCredentials: true,
  });

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <BorrowingRequestSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for borrowing requests'}
      />
    );
  };

  renderEmptyResultsExtra = () => {
    return (
      <NewButton
        text={'Create borrowing request'}
        to={ILLRoutes.borrowingRequestCreate}
      />
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderBorrowingRequestsList = results => {
    const entries = results.map(res => (
      <BorrowingRequestListEntry
        key={res.metadata.pid}
        borrowingRequest={res}
      />
    ));
    return (
      <Item.Group divided className={'bo-item-search'}>
        {entries}
      </Item.Group>
    );
  };

  render() {
    return (
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
                  <SearchAggregationsCards modelName={'borrowingRequests'} />
                </Grid.Column>
                <Grid.Column width={13}>
                  <Grid columns={3}>
                    <Grid.Column width={5}>
                      <NewButton
                        text={'Create new borrowing request'}
                        to={ILLRoutes.borrowingRequestCreate}
                      />
                    </Grid.Column>
                    <Grid.Column width={8} textAlign={'right'}>
                      <ExportReactSearchKitResults
                        exportBaseUrl={borrowingRequestApi.searchBaseURL}
                      />
                    </Grid.Column>
                  </Grid>
                  <SearchEmptyResults extras={this.renderEmptyResultsExtra} />
                  <Error renderElement={this.renderError} />
                  <SearchControls modelName={'borrowingRequests'} />
                  <ResultsList
                    renderElement={this.renderBorrowingRequestsList}
                  />
                  <SearchFooter />
                </Grid.Column>
              </ResultsLoader>
            </Grid.Row>
          </Grid>
        </Container>
      </ReactSearchKit>
    );
  }
}
