import { NotFound } from '@components';
import { getStaticPagesRoutes } from '@config/uiConfig';
import { StaticPage } from '@pages/frontsite/StaticPage';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { FrontSiteRoutes } from '../../urls';
import { Footer, ILSMenu, Home, PatronProfile } from '@pages/frontsite';
import { Container } from 'semantic-ui-react';
import { Notifications } from '@components/Notifications';

import {
  DocumentsDetailsContainer,
  DocumentsSearch,
} from '@pages/frontsite/Documents';

import { DocumentRequestForm } from '@pages/frontsite/DocumentRequests';

import { SeriesDetailsContainer } from '@pages/frontsite/Series';

export default class FrontSite extends Component {
  renderCustomStaticPages = () =>
    this.props.customStaticPages ? this.props.customStaticPages() : null;

  render() {
    const staticPagesRoutes = getStaticPagesRoutes();
    return (
      <div className="frontsite">
        <ILSMenu />
        <Notifications className="compact" />
        <Container fluid className="fs-content">
          <Switch>
            <Route
              exact
              path={FrontSiteRoutes.home}
              render={props => <Home {...props} {...this.props} />}
            />
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
            <Route
              exact
              path={FrontSiteRoutes.seriesDetails}
              component={SeriesDetailsContainer}
            />
            <Route
              exact
              path={FrontSiteRoutes.documentDetails}
              component={DocumentsDetailsContainer}
            />
            {staticPagesRoutes.map(route => (
              <Route key={route} exact path={route} component={StaticPage} />
            ))}
            {this.renderCustomStaticPages()}
            <Route>
              <NotFound />
            </Route>
          </Switch>
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
  customStaticPages: PropTypes.func,
};
