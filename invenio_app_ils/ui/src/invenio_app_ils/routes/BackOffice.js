import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BackOfficeURLS } from '../common/urls';
import {
  Header,
  Home,
  DocumentDetailsContainer,
  DocumentsSearch,
  ItemsSearch,
  ItemDetailsContainer,
  LoansSearch,
  LoanDetailsContainer,
  LocationList,
  UserDetailsContainer,
} from '../pages/backoffice';
import './BackOffice.scss';
import { Notifications } from '../common/components/Notifications';

export class BackOffice extends Component {
  render() {
    return (
      <div>
        <Header />
        <Notifications />
        <div className="container">
          {/* home */}
          <Route exact path={BackOfficeURLS.home} component={Home} />
          {/* documents */}
          <Route
            exact
            path={BackOfficeURLS.documentDetails}
            component={DocumentDetailsContainer}
          />
          {/* documents */}
          <Route
            exact
            path={BackOfficeURLS.documentsSearch}
            component={DocumentsSearch}
          />
          {/* items */}
          <Route
            exact
            path={BackOfficeURLS.itemsSearch}
            component={ItemsSearch}
          />
          <Route
            exact
            path={BackOfficeURLS.itemDetails}
            component={ItemDetailsContainer}
          />
          {/* loans */}
          <Route
            exact
            path={BackOfficeURLS.loansSearch}
            component={LoansSearch}
          />
          <Route
            exact
            path={BackOfficeURLS.loanDetails}
            component={LoanDetailsContainer}
          />
          {/* locations */}
          <Route
            exact
            path={BackOfficeURLS.locationList}
            component={LocationList}
          />
          {/* patrons */}
          <Route
            exact
            path={BackOfficeURLS.patronDetails}
            component={UserDetailsContainer}
          />
        </div>
      </div>
    );
  }
}
