import { literature as literatureApi } from '@api';
import {
  Error as IlsError,
  SearchBar as LiteratureSearchBar,
} from '@components';
import {
  SearchControls,
  SearchEmptyResults,
  SearchFooter,
} from '@components/SearchControls';
import { SearchControlsMobile } from '@components/SearchControls/SearchControlsMobile';
import history from '@history';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Error,
  InvenioSearchApi,
  ReactSearchKit,
  ResultsLoader,
  SearchBar,
  ResultsMultiLayout,
} from 'react-searchkit';
import { Container, Divider, Loader, Responsive } from 'semantic-ui-react';
import { qsBuilderForSeries } from './RequestSerializer';
import SeriesLiteratureResultsList from './SeriesLiteratureResultsList';
import SeriesLiteratureSearchResultsGrid from './SeriesLiteratureSearchResultsGrid';
import { SeriesLiteratureSearchMobile } from './SeriesLiteratureSearchMobile';

export class SeriesLiteratureSearch extends React.Component {
  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <LiteratureSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder="Search for volumes or issues..."
      />
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderLoader = () => {
    return (
      <Loader active size="huge" inline="centered" className="full-height" />
    );
  };

  render() {
    const { metadata } = this.props;
    const api = new InvenioSearchApi({
      axios: {
        url: literatureApi.searchBaseURL,
        withCredentials: true,
      },
      invenio: {
        requestSerializer: qsBuilderForSeries(metadata),
      },
    });
    return (
      <>
        <Divider horizontal>
          Literatures in this {metadata.mode_of_issuance.toUpperCase()}
        </Divider>
        <ReactSearchKit
          searchApi={api}
          history={history}
          urlHandlerApi={{ enabled: false }}
        >
          <Container className="series-details-search-container">
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <ResultsLoader renderElement={this.renderLoader}>
              <SearchEmptyResults />

              <Error renderElement={this.renderError} />

              <Responsive minWidth={Responsive.onlyComputer.minWidth}>
                <SearchControls
                  modelName="literature"
                  displayLayoutSwitcher={true}
                />
                <ResultsMultiLayout
                  resultsListCmp={() => <SeriesLiteratureResultsList />}
                  resultsGridCmp={() => <SeriesLiteratureSearchResultsGrid />}
                />
              </Responsive>
              <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
                <SearchControlsMobile
                  layoutToggle={this.renderResultsLayoutOptions}
                  modelName="literature"
                />
              </Responsive>
              <SearchFooter />
            </ResultsLoader>
          </Responsive>
          <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
            <SeriesLiteratureSearchMobile metadata={metadata} />
          </Responsive>
        </ReactSearchKit>
      </>
    );
  }
}

SeriesLiteratureSearch.propTypes = {
  metadata: PropTypes.object.isRequired,
};
