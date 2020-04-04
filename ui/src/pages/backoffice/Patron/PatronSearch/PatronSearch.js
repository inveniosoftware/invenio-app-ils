import { EmailLink, EmailCopyToClipboard } from '@components';
import {
  SearchAggregationsCards,
  SearchControls,
  SearchEmptyResults,
  SearchFooter,
} from '@components/SearchControls';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Container, Header } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  Error,
  InvenioSearchApi,
} from 'react-searchkit';
import { BackOfficeRoutes } from '@routes/urls';
import {
  Error as IlsError,
  SearchBar as PatronsSearchBar,
  ResultsTable,
} from '@components';
import { patron as patronApi } from '@api';
import { responseRejectInterceptor } from '@api/base';
import { getSearchConfig } from '@config';
import { ExportReactSearchKitResults } from '../../components';

export class PatronSearch extends Component {
  searchApi = new InvenioSearchApi({
    axios: {
      url: patronApi.searchBaseURL,
      withCredentials: true,
    },
    interceptors: {
      response: { reject: responseRejectInterceptor },
    },
  });
  searchConfig = getSearchConfig('patrons');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
      {
        name: 'name',
        field: 'name',
        defaultValue: '"Doe, John"',
      },
      {
        name: 'e-mail',
        field: 'email',
      },
    ];
    return (
      <PatronsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for patrons'}
        queryHelperFields={helperFields}
      />
    );
  };

  viewDetails = ({ row }) => {
    // NOTE: patrons have id in their metadata not pid.
    return (
      <Link
        as={Link}
        to={BackOfficeRoutes.patronDetailsFor(row.metadata.id)}
        icon="info"
        data-test={row.metadata.pid}
      >
        {row.metadata.name}
      </Link>
    );
  };

  mailTo = ({ row }) => {
    return (
      <>
        <EmailLink email={row.metadata.email} />{' '}
        <EmailCopyToClipboard email={row.metadata.email} />
      </>
    );
  };

  renderResultsTable = results => {
    const columns = [
      { title: 'Name', field: 'metadata.name', formatter: this.viewDetails },
      { title: 'E-mail', field: 'metadata.email', formatter: this.mailTo },
      { title: '#ID', field: 'metadata.id' },
    ];

    return <ResultsTable data={results} columns={columns} title={''} />;
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi}>
        <Container fluid className="spaced">
          <SearchBar renderElement={this.renderSearchBar} />
        </Container>
        <Grid>
          <Grid.Row columns={2}>
            <ResultsLoader>
              <Grid.Column width={3}>
                <Header content={'Filter by'} />
                <SearchAggregationsCards modelName={'patrons'} />
              </Grid.Column>
              <Grid.Column width={13}>
                <Grid columns={1}>
                  <Grid.Column textAlign="right">
                    <ExportReactSearchKitResults
                      exportBaseUrl={patronApi.searchBaseURL}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <SearchEmptyResults />
                    <Error renderElement={this.renderError} />
                    <SearchControls modelName={'patrons'} />
                    <ResultsList renderElement={this.renderResultsTable} />
                    <SearchFooter />
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </ResultsLoader>
          </Grid.Row>
        </Grid>
      </ReactSearchKit>
    );
  }
}
