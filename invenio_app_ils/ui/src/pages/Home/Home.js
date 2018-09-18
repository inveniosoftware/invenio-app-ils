import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import BookResults from './components/BookResults';
import MenuSidebar from './components/MenuSidebar';
import Statistics from './components/Statistics';
import { SIDEBAR_MENU_ITEMS } from '../../constants';

import './Home.css';

export default class Home extends Component {
  render() {
    return (
      <div className="home-container">
        {/* <div className="home-banner">
          <div className="home-title">CERN Library</div>
          <div className="home-description">
            Find books, e-books, articles, proceedings to loan at CERN.
          </div>
        </div> */}
        <Grid columns="equal">
          <Grid.Column width={2} className="sidebar-container">
            <MenuSidebar menuItems={SIDEBAR_MENU_ITEMS} />
          </Grid.Column>
          <Grid.Column className="book-list-container">
            <div className="home-banner">
              <div className="home-title">CERN Library</div>
              <div className="home-description">
                Find books, e-books, articles, proceedings to loan at CERN.
              </div>
            </div>
            <BookResults />
          </Grid.Column>
        </Grid>
        <Statistics />
      </div>
    );
  }
}
