import React, { Component, createRef } from 'react';
import { Container, Ref, Sticky } from 'semantic-ui-react';
import { ResultsLoader, Error, InvenioSearchApi } from 'react-searchkit';
import { getSearchConfig } from '../../../../common/config';
import { document as documentApi } from '../../../../common/api';
import {
  SearchFooter,
  SearchEmptyResults,
  SearchPagination,
} from '../../../../common/components/SearchControls/components';
import { SearchControlsMobile } from '../../../../common/components/SearchControls/SearchControlsMobile';
import { SearchMessage } from './SearchMessage';
import { DocumentSearchResultsGrid } from './DocumentSearchResultsGrid';

export class DocumentsSearchMobile extends Component {
  searchApi = new InvenioSearchApi({
    url: documentApi.searchBaseURL,
    withCredentials: true,
  });

  searchConfig = getSearchConfig('documents');

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
                <SearchControlsMobile ref={this.stickyRef} />
              </Sticky>
              <Container textAlign={'center'}>
                <SearchPagination />
              </Container>
              <Container className={'search-body'} textAlign={'center'}>
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
