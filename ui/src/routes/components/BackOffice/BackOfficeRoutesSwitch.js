import { NotFound } from '@components';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { BackOfficeRoutes, AcquisitionRoutes, ILLRoutes } from '@routes/urls';
import {
  BorrowingRequestDetails,
  BorrowingRequestEditor,
  BorrowingRequestSearch,
  DocumentDetails,
  DocumentEditor,
  DocumentRequestDetails,
  DocumentRequestSearch,
  DocumentSearch,
  EItemDetails,
  EItemEditor,
  EItemSearch,
  Home,
  InternalLocationEditor,
  ItemDetails,
  ItemEditor,
  ItemSearch,
  LibraryDetails,
  LibraryEditor,
  LibrarySearch,
  LoanDetails,
  LoanSearch,
  LocationEditor,
  LocationList,
  OrderDetails,
  OrderEditor,
  OrderSearch,
  PatronDetails,
  PatronSearch,
  SeriesDetails,
  SeriesEditor,
  SeriesSearch,
  Stats,
  VendorDetails,
  VendorEditor,
  VendorSearch,
} from '@pages/backoffice';

export default class extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={BackOfficeRoutes.home} component={Home} />
        {/* documents */}
        <Route
          exact
          path={BackOfficeRoutes.documentsList}
          component={DocumentSearch}
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
          component={DocumentDetails}
        />
        {/* eitems */}
        <Route
          exact
          path={BackOfficeRoutes.eitemsList}
          component={EItemSearch}
        />
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
          path={BackOfficeRoutes.eitemDetails}
          component={EItemDetails}
        />
        {/* items */}
        <Route exact path={BackOfficeRoutes.itemsList} component={ItemSearch} />
        <Route
          exact
          path={BackOfficeRoutes.itemCreate}
          component={ItemEditor}
        />
        <Route exact path={BackOfficeRoutes.itemEdit} component={ItemEditor} />
        <Route
          exact
          path={BackOfficeRoutes.itemDetails}
          component={ItemDetails}
        />
        {/* loans */}
        <Route exact path={BackOfficeRoutes.loansList} component={LoanSearch} />
        <Route
          exact
          path={BackOfficeRoutes.loanDetails}
          component={LoanDetails}
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
          path={BackOfficeRoutes.locationsList}
          component={LocationList}
        />
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
        {/* patrons */}
        <Route
          exact
          path={BackOfficeRoutes.patronsList}
          component={PatronSearch}
        />
        <Route
          exact
          path={BackOfficeRoutes.patronDetails}
          component={PatronDetails}
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
          component={DocumentRequestDetails}
        />
        <Route
          exact
          path={BackOfficeRoutes.documentRequestsList}
          component={DocumentRequestSearch}
        />
        {/* vendors */}
        <Route
          exact
          path={AcquisitionRoutes.vendorsList}
          component={VendorSearch}
        />
        <Route
          exact
          path={AcquisitionRoutes.vendorCreate}
          component={VendorEditor}
        />
        <Route
          exact
          path={AcquisitionRoutes.vendorEdit}
          component={VendorEditor}
        />
        <Route
          exact
          path={AcquisitionRoutes.vendorDetails}
          component={VendorDetails}
        />
        {/* orders */}
        <Route
          exact
          path={AcquisitionRoutes.ordersList}
          component={OrderSearch}
        />
        <Route
          exact
          path={AcquisitionRoutes.orderCreate}
          component={OrderEditor}
        />
        <Route
          exact
          path={AcquisitionRoutes.orderEdit}
          component={OrderEditor}
        />
        <Route
          exact
          path={AcquisitionRoutes.orderDetails}
          component={OrderDetails}
        />
        {/* ILL */}
        <Route exact path={ILLRoutes.libraryList} component={LibrarySearch} />
        <Route exact path={ILLRoutes.libraryCreate} component={LibraryEditor} />
        <Route exact path={ILLRoutes.libraryEdit} component={LibraryEditor} />
        <Route
          exact
          path={ILLRoutes.libraryDetails}
          component={LibraryDetails}
        />
        <Route
          exact
          path={ILLRoutes.borrowingRequestList}
          component={BorrowingRequestSearch}
        />
        <Route
          exact
          path={ILLRoutes.borrowingRequestCreate}
          component={BorrowingRequestEditor}
        />
        <Route
          exact
          path={ILLRoutes.borrowingRequestEdit}
          component={BorrowingRequestEditor}
        />
        <Route
          exact
          path={ILLRoutes.borrowingRequestDetails}
          component={BorrowingRequestDetails}
        />
        <Route exact path={BackOfficeRoutes.stats.home} component={Stats} />
        <Route>
          <NotFound />
        </Route>
      </Switch>
    );
  }
}
