import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import Statistics from './components/Statistics';

import './Home.scss';
import { apiConfig } from '../../../common/api/base';
import { document as documentApi } from '../../../common/api/documents/document';
import { ReactSearchKit, SearchBar } from 'react-searchkit';
import { SearchBar as DocumentsSearchBar } from '../../../common/components/SearchBar';
import { FrontSiteRoutes } from '../../../routes/urls';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import { MostLoanedDocuments } from './components/MostLoanedDocuments';
import { MostRecentDocuments } from './components/MostRecentDocuments';
import { default as config } from './config';
import { goTo } from '../../../history';

export default class Home extends Component {
  _renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const onBtnSearchClick = (event, input) => {
      executeSearch();
      goTo(FrontSiteRoutes.documentsListWithQuery(queryString));
    };

    return (
      <DocumentsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={onBtnSearchClick}
        placeholder={'Search for books, articles, proceedings...'}
        queryHelperFields={config.HELPER_FIELDS}
      />
    );
  };
  render() {
    return (
      <div className="home-container">
        <Grid centered columns={2}>
          <Header size="huge">What would you like to find?</Header>

          <Grid.Row centered columns={2}>
            <ReactSearchKit
              searchConfig={{
                ...apiConfig,
                url: documentApi.url,
              }}
            >
              <Container className="books-search-searchbar">
                <SearchBar renderElement={this._renderSearchBar} />
              </Container>
            </ReactSearchKit>
          </Grid.Row>

          <Grid.Row centered columns={2}>
            <Header size="medium">Most Loaned Documents</Header>
            <MostLoanedDocuments
              maxDisplayedItems={config.MAX_ITEMS_TO_DISPLAY}
              filter={config.DOCUMENT_TYPE}
            />
          </Grid.Row>

          <Grid.Row centered columns={2}>
            <Header size="medium">Most Recent Documents</Header>
            <MostRecentDocuments
              maxDisplayedItems={config.MAX_ITEMS_TO_DISPLAY}
              filter={config.DOCUMENT_TYPE}
            />
          </Grid.Row>

          <Grid.Row centered columns={2}>
            <Statistics />
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
