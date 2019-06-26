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
import { goToHandler } from '../../../history';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };
    this.updateQuery = this.updateQuery.bind(this);
  }

  updateQuery(event) {
    this.setState({ query: event.target.value });
  }

  render() {
    return (
      <div className="home-container">
        <Grid centered columns={2}>
          <Header size="huge">CERN Library</Header>

          <Grid.Row centered columns={2}>
            <Container className="books-search-searchbar">
              <Form
                onSubmit={goToHandler(
                  FrontSiteRoutes.documentsListWithQuery(this.state.query)
                )}
              >
                <Input
                  fluid
                  icon={
                    <Icon
                      name="search"
                      inverted
                      circular
                      link
                      onClick={goToHandler(
                        FrontSiteRoutes.documentsListWithQuery(this.state.query)
                      )}
                    />
                  }
                  size="large"
                  query={this.state.query}
                  onChange={this.updateQuery}
                  placeholder="Search for books, articles, proceedings..."
                />
              </Form>
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
