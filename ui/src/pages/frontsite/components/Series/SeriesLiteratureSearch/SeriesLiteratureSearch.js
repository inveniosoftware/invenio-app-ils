import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Loader, Responsive, Container } from 'semantic-ui-react';
import _get from 'lodash/get';
import {
  ReactSearchKit,
  InvenioSearchApi,
  ResultsList,
  SearchBar,
  Error,
  ResultsLoader,
} from 'react-searchkit';
import { literatureRequestSerializerCls } from './RequestSerializer';
import { literature as literatureApi } from '@api';
import {
  Error as IlsError,
  SearchBar as LiteratureSearchBar,
} from '@components';
import {
  SearchFooter,
  SearchEmptyResults,
  SearchControls,
} from '@components/SearchControls';
import history from '@history';
import { SeriesLiteratureResultsList } from './SeriesLiteratureResultsList';
import { SeriesLiteratureSearchMobile } from './SeriesLiteratureSearchMobile';
import { SearchControlsMobile } from '@components/SearchControls/SearchControlsMobile';

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
    const serialsCount = _get(metadata, 'relations_metadata.serial', []).length;
    const monographsCount = _get(
      metadata,
      'relations_metadata.multipart_monograph',
      []
    ).length;
    const documentsCount = serialsCount + monographsCount;
    const api = new InvenioSearchApi({
      invenio: {
        requestSerializer: literatureRequestSerializerCls(metadata),
      },
      url: literatureApi.searchBaseURL,
      withCredentials: true,
    });
    return (
      <>
        <Divider horizontal>
          Literature in this series ({documentsCount})
        </Divider>
        <ReactSearchKit searchApi={api} history={history}>
          <Container className="series-details-search-container">
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <ResultsLoader renderElement={this.renderLoader}>
              <SearchEmptyResults />

              <Error renderElement={this.renderError} />

              <Responsive minWidth={Responsive.onlyComputer.minWidth}>
                <SearchControls
                  layoutToggle={this.renderResultsLayoutOptions}
                  modelName="literature"
                />
              </Responsive>
              <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
                <SearchControlsMobile
                  layoutToggle={this.renderResultsLayoutOptions}
                  modelName="literature"
                />
              </Responsive>
              <ResultsList
                renderElement={results => (
                  <SeriesLiteratureResultsList
                    metadata={metadata}
                    results={results}
                  />
                )}
              />
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
