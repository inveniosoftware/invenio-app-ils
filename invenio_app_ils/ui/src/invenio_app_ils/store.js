import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { availableItemsReducer } from './pages/backoffice/LoanDetails/reducer';
import {
  documentDetailsReducer,
  documentPendingLoans,
  documentItems,
} from './pages/backoffice/DocumentDetails/reducer';
import {
  itemDetailsReducer,
  itemPastLoansReducer,
} from './pages/backoffice/ItemDetails/reducer';
import { loanDetailsReducer } from './pages/backoffice/LoanDetails/reducer';
import {
  itemsSearchByBarcodeReducer,
  patronCurrentLoansReducer,
  userDetailsReducer,
  patronItemCheckoutReducer,
} from './pages/backoffice/UserDetails/reducer';
import { patronPendingLoansReducer } from './pages/backoffice/UserDetails/reducer';
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

import { bookDetailsReducer } from './pages/frontsite/BookDetails/reducer';

const rootReducer = combineReducers({
  documentDetails: documentDetailsReducer,
  documentPendingLoans: documentPendingLoans,
  documentItems: documentItems,
  itemDetails: itemDetailsReducer,
  itemPastLoans: itemPastLoansReducer,
  loanDetails: loanDetailsReducer,
  userDetails: userDetailsReducer,
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
  bookDetails: bookDetailsReducer,
  itemsSearchInput: itemsSearchByBarcodeReducer,
  patronItemsCheckout: patronItemCheckoutReducer,
  notifications: notificationsReducer,
});

const composeEnhancers = composeWithDevTools({
  name: 'ILS Backoffice',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
