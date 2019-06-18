import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {
  patronCurrentLoansReducer,
  patronPastLoansReducer,
  patronPendingLoansReducer,
} from './common/state';
import { availableItemsReducer } from './pages/backoffice/LoanDetails/reducer';
import {
  documentDetailsReducer,
  documentStatsReducer,
  documentPendingLoans,
  documentItems,
} from './pages/backoffice/DocumentDetails/reducer';
import { deleteRecordModalReducer } from './pages/backoffice/components/DeleteRecordModal/reducer';
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
  idleLoansReducer,
  renewedLoansReducer,
} from './pages/backoffice/Home/reducer';
import { notificationsReducer } from './common/components/Notifications/reducer';
import { esSelectorReducer } from './common/components/ESSelector/reducer';
import {
  seriesDetailsReducer,
  seriesDocumentsReducer,
} from './pages/backoffice/SeriesDetails/reducer';

import {
  mostLoanedBooksReducer,
  mostRecentBooksReducer,
  mostRecentEbooksReducer,
} from './pages/frontsite/Home/reducer';
import { documentsDetailsReducer } from './pages/frontsite/DocumentsDetails/reducer';
import relatedRecordsReducer from './common/components/RelatedRecords/state/reducer';

const rootReducer = combineReducers({
  availableItems: availableItemsReducer,
  deleteRecordModal: deleteRecordModalReducer,
  documentDetails: documentDetailsReducer,
  documentItems: documentItems,
  documentPendingLoans: documentPendingLoans,
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
  patronItemsCheckout: patronItemCheckoutReducer,
  patronPastLoans: patronPastLoansReducer,
  patronPendingLoans: patronPendingLoansReducer,
  seriesDetails: seriesDetailsReducer,
  seriesDocuments: seriesDocumentsReducer,
  relatedRecords: relatedRecordsReducer,
});

const composeEnhancers = composeWithDevTools({
  name: 'ILS Backoffice',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
