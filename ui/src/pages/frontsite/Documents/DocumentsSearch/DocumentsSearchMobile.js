import React, { Component, createRef } from 'react';
import { Container, Ref, Sticky } from 'semantic-ui-react';
import { ResultsLoader, Error, InvenioSearchApi } from 'react-searchkit';
import { document as documentApi } from '@api';
import { responseRejectInterceptor } from '@api/base';
import {
  SearchFooter,
  SearchEmptyResults,
  SearchPagination,
} from '@components/SearchControls/components';
import { SearchControlsMobile } from '@components/SearchControls/SearchControlsMobile';
import { SearchMessage } from './SearchMessage';
import { DocumentSearchResultsGrid } from './DocumentSearchResultsGrid';

export class DocumentsSearchMobile extends Component {
  searchApi = new InvenioSearchApi({
    url: documentApi.searchBaseURL,
    withCredentials: true,
    interceptors: {
      response: { reject: responseRejectInterceptor },
    },
  });

  stickyRef = createRef();

  render() {
    return (
      <Container fluid className="grid-documents-search">
        <ResultsLoader>
          <SearchEmptyResults />
          <Error renderElement={this.renderError} />
          <Ref innerRef={this.stickyRef}>
            <Container fluid>
              <Sticky context={this.stickyRef} offset={66}>
                <SearchControlsMobile
                  ref={this.stickyRef}
                  modelName={'documents'}
                />
              </Sticky>
              <Container textAlign={'center'}>
                <SearchPagination />
              </Container>
              <Container className={'fs-search-body'} textAlign={'center'}>
                <DocumentSearchResultsGrid />
                <Container fluid className={'search-results-footer'}>
                  <SearchFooter />
                  <Container className={'search-results-message'}>
                    <SearchMessage />
                  </Container>
                </Container>
              </Container>
            </Container>
          </Ref>
        </ResultsLoader>
      </Container>
    );
  }
}
