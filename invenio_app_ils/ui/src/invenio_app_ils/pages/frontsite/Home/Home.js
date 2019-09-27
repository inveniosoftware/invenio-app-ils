import React, { Component } from 'react';
import { Container, Grid, Input, Form, Icon } from 'semantic-ui-react';
import Statistics from './components/Statistics';

import './Home.scss';
import { FrontSiteRoutes } from '../../../routes/urls';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import { MostLoanedBooks } from './components/MostLoanedBooks';
import { MostRecentBooks } from './components/MostRecentBooks';
import { MostRecentEbooks } from './components/MostRecentEbooks';
import { default as config } from './config';
import { goTo } from '../../../history';
import { SearchBar } from '../../../common/components/SearchBar';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };
  }

  updateSearchQuery = (value, event) => {
    this.setState({ query: event.target.value });
  };

  onSearchExecute = () => {
    const query = encodeURIComponent(this.state.query);
    goTo(FrontSiteRoutes.documentsListWithQuery(query));
  };

  render() {
    return (
      <div className="home-container">
        <Grid centered columns={2}>
          <Header size="huge">CERN Library</Header>

          <Grid.Row centered columns={2}>
            <Container className="books-search-searchbar">
              <SearchBar
                currentQueryString={this.state.searchQuery}
                onInputChange={this.updateSearchQuery}
                executeSearch={this.onSearchExecute}
                placeholder={'Search for books...'}
              />
            </Container>
          </Grid.Row>

          <Grid.Row centered columns={2}>
            <Header size="medium">Most Loaned Books</Header>
            <MostLoanedBooks maxDisplayedItems={config.MAX_ITEMS_TO_DISPLAY} />
          </Grid.Row>

          <Grid.Row centered columns={2}>
            <Header size="medium">Most Recent Books</Header>
            <MostRecentBooks maxDisplayedItems={config.MAX_ITEMS_TO_DISPLAY} />
          </Grid.Row>

          <Grid.Row centered columns={2}>
            <Header size="medium">Most Recent E-books</Header>
            <MostRecentEbooks maxDisplayedItems={config.MAX_ITEMS_TO_DISPLAY} />
          </Grid.Row>

          <Grid.Row centered columns={2}>
            <Statistics />
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
