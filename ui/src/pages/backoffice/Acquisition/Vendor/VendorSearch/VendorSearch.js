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
  SearchBar as VendorsSearchBar,
  SearchControls,
} from '@components';
import { vendor as vendorApi } from '@api';
import { getSearchConfig } from '@config';
import { AcquisitionRoutes } from '@routes/urls';
import {
  VendorList,
  ExportReactSearchKitResults,
  NewButton,
} from '../../../components';
import {
  SearchFooter,
  SearchEmptyResults,
} from '@components/SearchControls/components/';
import history from '@history';

export class VendorSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: vendorApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('vendors');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
      {
        name: 'name',
        field: 'name',
        defaultValue: '"Test vendor"',
      },
      {
        name: 'email',
        field: 'email',
        defaultValue: '"info@vendor.com"',
      },
      {
        name: 'address',
        field: 'address',
        defaultValue: '"Geneva"',
      },
    ];
    return (
      <VendorsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for vendors'}
        queryHelperFields={helperFields}
      />
    );
  };

  renderEmptyResultsExtra = () => {
    return (
      <NewButton text={'Add vendor'} to={AcquisitionRoutes.vendorCreate} />
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderVendorList = results => {
    return <VendorList hits={results} />;
  };

  render() {
    return (
      <>
        <Header as="h2">Vendors</Header>
        <ReactSearchKit searchApi={this.searchApi} history={history}>
          <Container fluid className="spaced">
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
          <Container fluid className="bo-search-body">
            <Grid>
              <Grid.Row columns={2}>
                <ResultsLoader>
                  <Grid.Column width={16}>
                    <Grid columns={2}>
                      <Grid.Column width={8}>
                        <NewButton
                          text={'Add vendor'}
                          to={AcquisitionRoutes.vendorCreate}
                        />
                      </Grid.Column>
                      <Grid.Column width={8} textAlign={'right'}>
                        <ExportReactSearchKitResults
                          exportBaseUrl={vendorApi.searchBaseURL}
                        />
                      </Grid.Column>
                    </Grid>
                    <SearchEmptyResults extras={this.renderEmptyResultsExtra} />
                    <Error renderElement={this.renderError} />
                    <SearchControls modelName={'vendors'} />
                    <ResultsList renderElement={this.renderVendorList} />
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
