import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { FrontSiteRoutes } from '../../urls';
import { Footer, ILSMenu, Home, PatronProfile } from '@pages/frontsite';
import { Container } from 'semantic-ui-react';
import { Notifications } from '@components/Notifications';

import {
  DocumentsDetailsContainer,
  DocumentsSearch,
} from '@pages/frontsite/Documents';

import { DocumentRequestForm } from '@pages/frontsite/DocumentRequests';

export default class FrontSite extends Component {
  render() {
    return (
      <div className="frontsite">
        <ILSMenu />
        <Notifications className="compact" />
        <Container fluid className="fs-content">
          {/* home */}
          <Route
            exact
            path={FrontSiteRoutes.home}
            render={props => <Home {...props} {...this.props} />}
          />
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
          <Route
            exact
            path={FrontSiteRoutes.patronProfile}
            component={PatronProfile}
          />
          <Route
            exact
            path={FrontSiteRoutes.documentRequestForm}
            component={DocumentRequestForm}
          />
        </Container>
        <Footer />
      </div>
    );
  }
}

FrontSite.propTypes = {
  headline: PropTypes.func,
  headlineImage: PropTypes.string,
  sections: PropTypes.array,
};
