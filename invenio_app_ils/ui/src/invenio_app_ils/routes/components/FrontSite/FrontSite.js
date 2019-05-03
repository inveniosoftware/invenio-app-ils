import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { FrontSiteRoutes } from '../../urls';
import {
  Footer,
  Header,
  Home,
  DocumentsDetailsContainer,
  DocumentsSearch,
} from '../../../pages/frontsite';
import './FrontSite.scss';
import { Notifications } from '../../../common/components/Notifications';

export class FrontSite extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <Notifications />
        <div className="app-content">
          {/* home */}
          <Route exact path={FrontSiteRoutes.home} component={Home} />
          {/* documents */}
          <Route
            exact
            path={FrontSiteRoutes.documentDetails}
            component={DocumentsDetailsContainer}
          />
          {/* documents */}
          <Route
            exact
            path={FrontSiteRoutes.documentsList}
            component={DocumentsSearch}
          />
        </div>
        <Footer />
      </div>
    );
  }
}
