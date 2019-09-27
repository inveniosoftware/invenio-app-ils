import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { BackOfficeRoutes } from '../../urls';
import {
  Header,
  Home,
  DocumentDetailsContainer,
  DocumentsSearch,
  DocumentRequestDetailsContainer,
  DocumentRequestsSearch,
  EItemsSearch,
  EItemDetailsContainer,
  ItemsSearch,
  ItemDetailsContainer,
  InternalLocationEditor,
  LoansSearch,
  LoanDetailsContainer,
  LocationEditor,
  LocationList,
  PatronDetailsContainer,
  PatronsSearch,
  SeriesEditor,
  SeriesDetails,
  SeriesSearch,
  Stats,
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
          <Switch>
            <Route exact path={BackOfficeRoutes.home} component={Home} />
            {/* documents */}
            <Route
              exact
              path={BackOfficeRoutes.documentsList}
              component={DocumentsSearch}
            />
            {/* documents */}
            <Route
              exact
              path={BackOfficeRoutes.documentDetails}
              component={DocumentDetailsContainer}
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
            {/* internal locations */}
            <Route
              exact
              path={BackOfficeRoutes.ilocationsCreate}
              component={InternalLocationEditor}
            />
            <Route
              exact
              path={BackOfficeRoutes.ilocationsEdit}
              component={InternalLocationEditor}
            />
            {/* locations */}
            <Route
              exact
              path={BackOfficeRoutes.locationsCreate}
              component={LocationEditor}
            />
            <Route
              exact
              path={BackOfficeRoutes.locationsEdit}
              component={LocationEditor}
            />
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
              path={BackOfficeRoutes.seriesCreate}
              component={SeriesEditor}
            />
            <Route
              exact
              path={BackOfficeRoutes.seriesEdit}
              component={SeriesEditor}
            />
            <Route
              exact
              path={BackOfficeRoutes.seriesDetails}
              component={SeriesDetails}
            />
            {/* document requests */}
            <Route
              exact
              path={BackOfficeRoutes.documentRequestDetails}
              component={DocumentRequestDetailsContainer}
            />
            <Route
              exact
              path={BackOfficeRoutes.documentRequestsList}
              component={DocumentRequestsSearch}
            />
            <Route exact path={BackOfficeRoutes.stats.home} component={Stats} />
          </Switch>
        </div>
      </div>
    );
  }
}
