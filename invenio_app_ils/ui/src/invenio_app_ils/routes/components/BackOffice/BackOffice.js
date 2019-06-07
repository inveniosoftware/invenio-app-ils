import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BackOfficeRoutes } from '../../urls';
import {
  Header,
  Home,
  DocumentDetailsContainer,
  DocumentsSearch,
  EItemsSearch,
  EItemDetailsContainer,
  ItemsSearch,
  ItemDetailsContainer,
  LoansSearch,
  LoanDetailsContainer,
  LocationList,
  PatronDetailsContainer,
  PatronsSearch,
  SeriesDetailsContainer,
  SeriesSearch,
} from '../../../pages/backoffice';
import './BackOffice.scss';
import { Notifications } from '../../../common/components/Notifications';

export class BackOffice extends Component {
  render() {
    return (
      <div>
        <Header />
        <Notifications />
        <div className="container">
          {/* home */}
          <Route exact path={BackOfficeRoutes.home} component={Home} />
          {/* documents */}
          <Route
            exact
            path={BackOfficeRoutes.documentDetails}
            component={DocumentDetailsContainer}
          />
          {/* documents */}
          <Route
            exact
            path={BackOfficeRoutes.documentsList}
            component={DocumentsSearch}
          />
          {/* eitems */}
          <Route
            exact
            path={BackOfficeRoutes.eitemsList}
            component={EItemsSearch}
          />
          <Route
            exact
            path={BackOfficeRoutes.eitemDetails}
            component={EItemDetailsContainer}
          />
          {/* items */}
          <Route
            exact
            path={BackOfficeRoutes.itemsList}
            component={ItemsSearch}
          />
          <Route
            exact
            path={BackOfficeRoutes.itemDetails}
            component={ItemDetailsContainer}
          />
          {/* loans */}
          <Route
            exact
            path={BackOfficeRoutes.loansList}
            component={LoansSearch}
          />
          <Route
            exact
            path={BackOfficeRoutes.loanDetails}
            component={LoanDetailsContainer}
          />
          {/* locations */}
          <Route
            exact
            path={BackOfficeRoutes.locationsList}
            component={LocationList}
          />
          {/* patrons */}
          <Route
            exact
            path={BackOfficeRoutes.patronsList}
            component={PatronsSearch}
          />
          <Route
            exact
            path={BackOfficeRoutes.patronDetails}
            component={PatronDetailsContainer}
          />
          {/* series */}
          <Route
            exact
            path={BackOfficeRoutes.seriesList}
            component={SeriesSearch}
          />
          <Route
            exact
            path={BackOfficeRoutes.seriesDetails}
            component={SeriesDetailsContainer}
          />
        </div>
      </div>
    );
  }
}
