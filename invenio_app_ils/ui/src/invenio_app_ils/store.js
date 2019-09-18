import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {
  patronCurrentLoansReducer,
  patronDocumentRequestsReducer,
  patronPastLoansReducer,
  patronPendingLoansReducer,
} from './common/state';
import { availableItemsReducer } from './pages/backoffice/LoanDetails/reducer';
import {
  documentDetailsReducer,
  documentStatsReducer,
  documentPendingLoans,
  documentItems,
  documentRelations,
} from './pages/backoffice/DocumentDetails/reducer';
import { deleteRecordModalReducer } from './pages/backoffice/components/DeleteRecordModal/reducer';
import { sendMailModalReducer } from './pages/backoffice/components/SendMailModal/reducer';
import { eitemDetailsReducer } from './pages/backoffice/EItemDetails/reducer';
import {
  itemDetailsReducer,
  itemPastLoansReducer,
} from './pages/backoffice/ItemDetails/reducer';
import { loanDetailsReducer } from './pages/backoffice/LoanDetails/reducer';
import {
  itemsSearchByBarcodeReducer,
  patronDetailsReducer,
  patronItemCheckoutReducer,
} from './pages/backoffice/PatronDetails/reducer';
import {
  locationListReducer,
  internalLocationListReducer,
} from './pages/backoffice/LocationList/reducer';
import {
  loansCardReducer,
  documentsCardReducer,
  overbookedDocumentsReducer,
  overdueLoansReducer,
  pendingOverdueDocumentsReducer,
  idleLoansReducer,
  renewedLoansReducer,
} from './pages/backoffice/Home/reducer';
import { mostLoanedDocumentsReducer } from './pages/backoffice/Stats/reducer';
import { notificationsReducer } from './common/components/Notifications/reducer';
import { esSelectorReducer } from './common/components/ESSelector/reducer';
import {
  seriesDetailsReducer,
  seriesDocumentsReducer,
  seriesMultipartMonographsReducer,
  seriesRelationsReducer,
} from './pages/backoffice/SeriesDetails/reducer';

import {
  mostLoanedBooksReducer,
  mostRecentBooksReducer,
  mostRecentEbooksReducer,
} from './pages/frontsite/Home/reducer';
import {
  documentsDetailsReducer,
  loanRequestFormReducer,
} from './pages/frontsite/DocumentsDetails/reducer';
import { documentRequestDetailsReducer } from './pages/backoffice/DocumentRequestDetails/reducer';
import documentRequestFormReducer from './pages/frontsite/DocumentRequestForm/state/reducer';

const rootReducer = combineReducers({
  availableItems: availableItemsReducer,
  deleteRecordModal: deleteRecordModalReducer,
  documentDetails: documentDetailsReducer,
  documentItems: documentItems,
  documentPendingLoans: documentPendingLoans,
  documentRelations: documentRelations,
  documentRequestDetails: documentRequestDetailsReducer,
  documentRequestForm: documentRequestFormReducer,
  documentsCard: documentsCardReducer,
  documentsDetails: documentsDetailsReducer,
  documentStats: documentStatsReducer,
  eitemDetails: eitemDetailsReducer,
  esSelector: esSelectorReducer,
  idlePendingLoans: idleLoansReducer,
  internalLocations: internalLocationListReducer,
  itemDetails: itemDetailsReducer,
  itemPastLoans: itemPastLoansReducer,
  itemsSearchInput: itemsSearchByBarcodeReducer,
  latestRenewedLoans: renewedLoansReducer,
  loanDetails: loanDetailsReducer,
  loanRequestForm: loanRequestFormReducer,
  loansCard: loansCardReducer,
  locations: locationListReducer,
  mostLoanedBooks: mostLoanedBooksReducer,
  mostRecentBooks: mostRecentBooksReducer,
  mostRecentEbooks: mostRecentEbooksReducer,
  notifications: notificationsReducer,
  overbookedDocuments: overbookedDocumentsReducer,
  overdueLoans: overdueLoansReducer,
  patronCurrentLoans: patronCurrentLoansReducer,
  patronDetails: patronDetailsReducer,
  patronDocumentRequests: patronDocumentRequestsReducer,
  patronItemsCheckout: patronItemCheckoutReducer,
  patronPastLoans: patronPastLoansReducer,
  patronPendingLoans: patronPendingLoansReducer,
  pendingOverdueDocuments: pendingOverdueDocumentsReducer,
  sendMailModal: sendMailModalReducer,
  seriesDetails: seriesDetailsReducer,
  seriesDocuments: seriesDocumentsReducer,
  seriesMultipartMonographs: seriesMultipartMonographsReducer,
  seriesRelations: seriesRelationsReducer,
  statsMostLoanedDocuments: mostLoanedDocumentsReducer,
});

const composeEnhancers = composeWithDevTools({
  name: 'ILS Backoffice',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
