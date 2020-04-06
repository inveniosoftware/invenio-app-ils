import { recordRelationsReducer } from '@pages/backoffice/components/Relations/reducer';
import { relationSelectorReducer } from '@pages/backoffice/components/Relations/reducer';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {
  patronCurrentLoansReducer,
  patronDocumentRequestsReducer,
  patronPastLoansReducer,
  patronPendingLoansReducer,
} from './state';
import { authenticationReducer } from '@authentication/reducer';
import {
  availableItemsReducer,
  loanDetailsReducer,
} from '@pages/backoffice/Loan/LoanDetails/reducer';
import {
  documentDetailsReducer,
  documentStatsReducer,
  documentPendingLoans,
  documentItems,
  documentEItems,
} from '@pages/backoffice/Document/DocumentDetails/reducer';
import { deleteRecordModalReducer } from '@pages/backoffice/components/DeleteRecordModal/reducer';
import { overdueLoanSendMailModalReducer } from '@pages/backoffice/components/OverdueLoanSendMailModal/reducer';
import { eitemDetailsReducer } from '@pages/backoffice/EItem/EItemDetails/reducer';
import {
  itemDetailsReducer,
  itemPastLoansReducer,
} from '@pages/backoffice/Item/ItemDetails/reducer';
import {
  itemsSearchByBarcodeReducer,
  patronDetailsReducer,
  patronItemCheckoutReducer,
} from '@pages/backoffice/Patron/PatronDetails/reducer';
import {
  locationListReducer,
  internalLocationListReducer,
} from '@pages/backoffice/Location/LocationList/reducer';
import {
  loansCardReducer,
  documentsCardReducer,
  overbookedDocumentsReducer,
  overdueLoansReducer,
  pendingOverdueDocumentsReducer,
  idleLoansReducer,
  renewedLoansReducer,
} from '@pages/backoffice/Home/reducer';
import { mostLoanedDocumentsReducer } from '@pages/backoffice/Stats/reducer';
import { notificationsReducer } from './components/Notifications/reducer';
import {
  seriesDetailsReducer,
  seriesDocumentsReducer,
  seriesMultipartMonographsReducer,
  seriesRelationsReducer,
} from '@pages/backoffice/Series/SeriesDetails/reducer';
import {
  documentDetailsFrontReducer,
  loanRequestFormReducer,
} from '@pages/frontsite/Documents/DocumentsDetails/reducer';
import { documentRequestDetailsReducer } from '@pages/backoffice/DocumentRequest/DocumentRequestDetails/reducer';
import {
  borrowingRequestDetailsReducer,
  libraryDetailsReducer,
} from '@pages/backoffice/ILL';
import {
  patronCurrentDocumentRequestsReducer,
  patronPastDocumentRequestsReducer,
} from '@pages/frontsite/PatronProfile/reducer';
import {
  orderDetailsReducer,
  vendorDetailsReducer,
} from '@pages/backoffice/Acquisition';
import { seriesDetailsFrontReducer } from '@pages/frontsite/Series/SeriesDetails/reducer';

const rootReducer = combineReducers({
  availableItems: availableItemsReducer,
  authenticationManagement: authenticationReducer,
  borrowingRequestDetails: borrowingRequestDetailsReducer,
  deleteRecordModal: deleteRecordModalReducer,
  recordRelationsSelections: relationSelectorReducer,
  recordRelations: recordRelationsReducer,
  documentDetails: documentDetailsReducer,
  documentItems: documentItems,
  documentEItems: documentEItems,
  documentPendingLoans: documentPendingLoans,
  documentRequestDetails: documentRequestDetailsReducer,
  documentsCard: documentsCardReducer,
  documentDetailsFront: documentDetailsFrontReducer,
  documentStats: documentStatsReducer,
  eitemDetails: eitemDetailsReducer,
  idlePendingLoans: idleLoansReducer,
  internalLocations: internalLocationListReducer,
  itemDetails: itemDetailsReducer,
  itemPastLoans: itemPastLoansReducer,
  itemsSearchInput: itemsSearchByBarcodeReducer,
  latestRenewedLoans: renewedLoansReducer,
  libraryDetails: libraryDetailsReducer,
  loanDetails: loanDetailsReducer,
  loanRequestForm: loanRequestFormReducer,
  loansCard: loansCardReducer,
  locations: locationListReducer,
  notifications: notificationsReducer,
  orderDetails: orderDetailsReducer,
  overbookedDocuments: overbookedDocumentsReducer,
  overdueLoans: overdueLoansReducer,
  overdueLoanSendMailModal: overdueLoanSendMailModalReducer,
  patronCurrentLoans: patronCurrentLoansReducer,
  patronDetails: patronDetailsReducer,
  patronDocumentRequests: patronDocumentRequestsReducer,
  patronPastDocumentRequests: patronPastDocumentRequestsReducer,
  patronCurrentDocumentRequests: patronCurrentDocumentRequestsReducer,
  patronItemsCheckout: patronItemCheckoutReducer,
  patronPastLoans: patronPastLoansReducer,
  patronPendingLoans: patronPendingLoansReducer,
  pendingOverdueDocuments: pendingOverdueDocumentsReducer,
  seriesDetails: seriesDetailsReducer,
  seriesDetailsFront: seriesDetailsFrontReducer,
  seriesDocuments: seriesDocumentsReducer,
  seriesMultipartMonographs: seriesMultipartMonographsReducer,
  seriesRelations: seriesRelationsReducer,
  statsMostLoanedDocuments: mostLoanedDocumentsReducer,
  vendorDetails: vendorDetailsReducer,
});

const composeEnhancers = composeWithDevTools({
  name: 'ILS Backoffice',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
