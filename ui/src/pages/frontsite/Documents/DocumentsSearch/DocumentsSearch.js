import React, { Component } from 'react';
import { Container, Grid, Header, Responsive, Loader } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsLoader,
  Error,
  InvenioSearchApi,
  ResultsMultiLayout,
} from 'react-searchkit';
import {
  Error as IlsError,
  SearchBar as DocumentsSearchBar,
} from '@components';
import { literature as literatureApi } from '@api';
import { responseRejectInterceptor } from '@api/base';
import { SearchControls } from '@components';
import {
  SearchAggregationsCards,
  SearchFooter,
  SearchEmptyResults,
} from '@components/SearchControls/components';
import { DocumentsSearchMobile } from './DocumentsSearchMobile';
import { SearchMessage } from './SearchMessage';
import { DocumentSearchResultsGrid } from './DocumentSearchResultsGrid';
import { DocumentSearchResultsList } from './DocumentSearchResultsList';
import history from '@history';

export class DocumentsSearch extends Component {
  searchApi = new InvenioSearchApi({
    axios: {
      url: literatureApi.searchBaseURL,
      withCredentials: true,
    },
    interceptors: {
      response: { reject: responseRejectInterceptor },
    },
  });
  state = { activeIndex: 0 };

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <DocumentsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for records...'}
      />
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderLoader = () => {
    return (
      <Loader active size="huge" inline="centered" className={'full-height'} />
    );
  };

  render() {
    return (
      <>
        <ReactSearchKit searchApi={this.searchApi} history={history}>
          <Container fluid className="document-details-search-container">
            <Container>
              <SearchBar renderElement={this.renderSearchBar} />
            </Container>
          </Container>
          <Responsive minWidth={Responsive.onlyComputer.minWidth}>
            <Container fluid className="fs-search-body">
              <Grid
                columns={2}
                stackable
                relaxed
                className="grid-documents-search"
              >
                <ResultsLoader renderElement={this.renderLoader}>
                  <Grid.Column width={3} className="search-aggregations">
                    <Header content={'Filter by'} />
                    <SearchAggregationsCards modelName={'documents'} />
                  </Grid.Column>
                  <Grid.Column width={13} className="search-results">
                    <SearchEmptyResults />
                    <Error renderElement={this.renderError} />
                    <SearchControls modelName={'documents'} />
                    <ResultsMultiLayout
                      resultsListCmp={() => <DocumentSearchResultsList />}
                      resultsGridCmp={() => <DocumentSearchResultsGrid />}
                    />
                    <Container fluid className={'search-results-footer'}>
                      <SearchFooter />
                      <Container className={'search-results-message'}>
                        <SearchMessage />
                      </Container>
                    </Container>
                  </Grid.Column>
                </ResultsLoader>
              </Grid>
            </Container>
          </Responsive>
          <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
            <DocumentsSearchMobile />
          </Responsive>
        </ReactSearchKit>
      </>
    );
  }
}
