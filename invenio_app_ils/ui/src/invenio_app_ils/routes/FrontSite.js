import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Footer, Header, Home } from '../pages/frontsite';
import { FrontSiteURLS } from '../common/urls';
import './FrontSite.scss';

export class FrontSite extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-content">
          {/* home */}
          <Route exact path={FrontSiteURLS.home} component={Home} />
        </div>
        <Footer />
      </div>
    );
  }
}
