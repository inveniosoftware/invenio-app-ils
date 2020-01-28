import React from 'react';
import PropTypes from 'prop-types';
import { Container, Ref, Sticky } from 'semantic-ui-react';
import { ResultsLoader, Error } from 'react-searchkit';
import {
  SearchFooter,
  SearchEmptyResults,
  SearchPagination,
} from '@components/SearchControls/components';
import { Error as IlsError } from '@components';
import { SearchControlsMobile } from '@components/SearchControls/SearchControlsMobile';
import SeriesLiteratureSearchResultsGrid from './SeriesLiteratureSearchResultsGrid';

export class SeriesLiteratureSearchMobile extends React.Component {
  stickyRef = React.createRef();

  renderError = error => {
    return <IlsError error={error} />;
  };

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
                  modelName="literature"
                />
              </Sticky>
              <Container textAlign="center">
                <SearchPagination />
              </Container>
              <Container className="fs-search-body" textAlign="center">
                <SeriesLiteratureSearchResultsGrid
                  metadata={this.props.metadata}
                />
                <Container fluid className="search-results-footer">
                  <SearchFooter />
                </Container>
              </Container>
            </Container>
          </Ref>
        </ResultsLoader>
      </Container>
    );
  }
}

SeriesLiteratureSearchMobile.propTypes = {
  metadata: PropTypes.object.isRequired,
};
