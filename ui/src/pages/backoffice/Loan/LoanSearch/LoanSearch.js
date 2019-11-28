import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Segment,
  Icon,
  Header,
  Button,
  Container,
} from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  Error,
  InvenioSearchApi,
} from 'react-searchkit';
import { getSearchConfig } from '@config';
import { Error as IlsError, SearchBar as LoansSearchBar } from '@components';
import { NewButton, OverdueLoanSendMailModal } from '../../components';
import { loan as loanApi } from '@api/loans/loan';
import { BackOfficeRoutes } from '@routes/urls';
import history from '@history';
import LoanList from './LoanList';
import {
  SearchControls,
  SearchEmptyResults,
  SearchFooter,
  SearchAggregationsCards,
} from '@components/SearchControls';

export class LoanSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: loanApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('loans');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
      {
        name: 'patron',
        field: 'patron.name',
        defaultValue: '"Doe, John"',
      },
      {
        name: 'title',
        field: 'document.title',
        defaultValue: '"Little Prince"'
      }
    ];

    return (
      <LoansSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for loans'}
        queryHelperFields={helperFields}
      />
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderEmptyResultsExtra = () => {
    return (
      <NewButton text={'Add document'} to={BackOfficeRoutes.documentCreate} />
    );
  };

  renderLoanList = results => {
    return <LoanList hits={results} />;
  };

  render() {
    return (
      <>
      <Header as="h2">Loans and requests</Header>

      <ReactSearchKit searchApi={this.searchApi} history={history}>
        <Container fluid className="spaced">
          <SearchBar renderElement={this.renderSearchBar} />
        </Container>
        <Grid>
          <Grid.Row columns={2}>
            <ResultsLoader>
              <Grid.Column width={3} className={'search-aggregations'}>
                <Header content={'Filter by'} />
                <SearchAggregationsCards modelName={'loans'} />
              </Grid.Column>
              <Grid.Column width={13}>
                <SearchEmptyResults extras={this.renderEmptyResultsExtra} />
                <Error renderElement={this.renderError} />
                <SearchControls modelName={'loans'} />
                <ResultsList renderElement={this.renderLoanList} />
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
