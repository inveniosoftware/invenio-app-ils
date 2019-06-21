import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

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
  patronCurrentLoansReducer,
  patronDetailsReducer,
  patronItemCheckoutReducer,
} from './pages/backoffice/PatronDetails/reducer';
import { patronPendingLoansReducer } from './pages/backoffice/PatronDetails/reducer';
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
  mostLoanedDocumentsReducer,
  mostRecentDocumentsReducer,
} from './pages/frontsite/Home/reducer';
import { documentsDetailsReducer } from './pages/frontsite/DocumentsDetails/reducer';

const rootReducer = combineReducers({
  deleteRecordModal: deleteRecordModalReducer,
  documentDetails: documentDetailsReducer,
  documentPendingLoans: documentPendingLoans,
  documentStats: documentStatsReducer,
  documentItems: documentItems,
  eitemDetails: eitemDetailsReducer,
  itemDetails: itemDetailsReducer,
  itemPastLoans: itemPastLoansReducer,
  loanDetails: loanDetailsReducer,
  patronDetails: patronDetailsReducer,
  patronPendingLoans: patronPendingLoansReducer,
  patronCurrentLoans: patronCurrentLoansReducer,
  availableItems: availableItemsReducer,
  locations: locationListReducer,
  internalLocations: internalLocationListReducer,
  loansCard: loansCardReducer,
  documentsCard: documentsCardReducer,
  overbookedDocuments: overbookedDocumentsReducer,
  overdueLoans: overdueLoansReducer,
  idlePendingLoans: idleLoansReducer,
  latestRenewedLoans: renewedLoansReducer,
  documentsDetails: documentsDetailsReducer,
  itemsSearchInput: itemsSearchByBarcodeReducer,
  patronItemsCheckout: patronItemCheckoutReducer,
  notifications: notificationsReducer,
  mostLoanedDocuments: mostLoanedDocumentsReducer,
  mostRecentDocuments: mostRecentDocumentsReducer,
  esSelector: esSelectorReducer,
  seriesDetails: seriesDetailsReducer,
  seriesDocuments: seriesDocumentsReducer,
});

const composeEnhancers = composeWithDevTools({
  name: 'ILS Backoffice',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
