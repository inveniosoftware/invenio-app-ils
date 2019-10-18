import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { BackOfficeRoutes } from '../../urls';
import {
  Home,
  DocumentEditor,
  DocumentDetailsContainer,
  DocumentsSearch,
  DocumentRequestDetailsContainer,
  DocumentRequestsSearch,
  EItemEditor,
  EItemSearch,
  EItemDetails,
  ItemEditor,
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

export default class extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={BackOfficeRoutes.home} component={Home} />
        {/* documents */}
        <Route
          exact
          path={BackOfficeRoutes.documentsList}
          component={DocumentsSearch}
        />
        <Route
          exact
          path={BackOfficeRoutes.documentCreate}
          component={DocumentEditor}
        />
        <Route
          exact
          path={BackOfficeRoutes.documentEdit}
          component={DocumentEditor}
        />
        <Route
          exact
          path={BackOfficeRoutes.documentDetails}
          component={DocumentDetailsContainer}
        />
        {/* eitems */}
        <Route
          exact
          path={BackOfficeRoutes.eitemCreate}
          component={EItemEditor}
        />
        <Route
          exact
          path={BackOfficeRoutes.eitemEdit}
          component={EItemEditor}
        />
        <Route
          exact
          path={BackOfficeRoutes.eitemsList}
          component={EItemSearch}
        />
        <Route
          exact
          path={BackOfficeRoutes.eitemDetails}
          component={EItemDetails}
        />
        {/* items */}
        <Route
          exact
          path={BackOfficeRoutes.itemCreate}
          component={ItemEditor}
        />
        <Route exact path={BackOfficeRoutes.itemEdit} component={ItemEditor} />
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
    );
  }
}
