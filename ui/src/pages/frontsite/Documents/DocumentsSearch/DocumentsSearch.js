import React, { Component } from 'react';
import {
  Button,
  Container,
  Grid,
  Icon,
  Header,
  Responsive,
  Loader,
} from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsLoader,
  Error,
  InvenioSearchApi,
} from 'react-searchkit';
import {
  Error as IlsError,
  SearchBar as DocumentsSearchBar,
} from '@components';
import { document as documentApi } from '@api';
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
    url: documentApi.searchBaseURL,
    withCredentials: true,
    interceptors: {
      response: { reject: responseRejectInterceptor },
    },
  });
  state = { activeIndex: 0, isLayoutGrid: true };

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

  renderResultsLayoutOptions = () => {
    const toggleLayout = () => {
      this.setState({ isLayoutGrid: !this.state.isLayoutGrid });
    };
    return (
      <Button.Group basic icon className={'search-layout-toggle'}>
        <Button disabled={this.state.isLayoutGrid} onClick={toggleLayout}>
          <Icon name="grid layout" />
        </Button>
        <Button disabled={!this.state.isLayoutGrid} onClick={toggleLayout}>
          <Icon name="list layout" />
        </Button>
      </Button.Group>
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

                    <SearchControls
                      layoutToggle={this.renderResultsLayoutOptions}
                      modelName={'documents'}
                    />
                    {this.state.isLayoutGrid ? (
                      <DocumentSearchResultsGrid />
                    ) : (
                      <DocumentSearchResultsList />
                    )}
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
