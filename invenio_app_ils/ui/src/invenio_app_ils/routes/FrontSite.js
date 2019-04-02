import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { FrontSiteURLS } from '../common/urls';
import { Footer, Header, Home, BookDetailsContainer } from '../pages/frontsite';
import './FrontSite.scss';
import { Notifications } from '../common/components/Notifications';

export class FrontSite extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <Notifications />
        <div className="app-content">
          {/* home */}
          <Route exact path={FrontSiteURLS.home} component={Home} />
          {/* books */}
          <Route
            exact
            path={FrontSiteURLS.bookDetails}
            component={BookDetailsContainer}
          />
        </div>
        <Footer />
      </div>
    );
  }
}
