import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {
  patronCurrentLoansReducer,
  patronDocumentRequestsReducer,
  patronPastLoansReducer,
  patronPendingLoansReducer,
} from './state';
import { availableItemsReducer } from '@pages/backoffice/LoanDetails/reducer';
import {
  documentDetailsReducer,
  documentStatsReducer,
  documentPendingLoans,
  documentItems,
  documentRelations,
} from '@pages/backoffice/DocumentDetails/reducer';
import { deleteRecordModalReducer } from '@pages/backoffice/components/DeleteRecordModal/reducer';
import { overdueLoanSendMailModalReducer } from '@pages/backoffice/components/OverdueLoanSendMailModal/reducer';
import { eitemDetailsReducer } from '@pages/backoffice/EItem/EItemDetails/reducer';
import {
  itemDetailsReducer,
  itemPastLoansReducer,
} from '@pages/backoffice/ItemDetails/reducer';
import { loanDetailsReducer } from '@pages/backoffice/LoanDetails/reducer';
import {
  itemsSearchByBarcodeReducer,
  patronDetailsReducer,
  patronItemCheckoutReducer,
} from '@pages/backoffice/PatronDetails/reducer';
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
import { documentRequestDetailsReducer } from '@pages/backoffice/DocumentRequestDetails/reducer';
import {
  patronCurrentDocumentRequestsReducer,
  patronPastDocumentRequestsReducer,
} from '@pages/frontsite/PatronProfile/reducer';

const rootReducer = combineReducers({
  availableItems: availableItemsReducer,
  deleteRecordModal: deleteRecordModalReducer,
  documentDetails: documentDetailsReducer,
  documentItems: documentItems,
  documentPendingLoans: documentPendingLoans,
  documentRelations: documentRelations,
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
  loanDetails: loanDetailsReducer,
  loanRequestForm: loanRequestFormReducer,
  loansCard: loansCardReducer,
  locations: locationListReducer,
  notifications: notificationsReducer,
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
