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
import { userDetailsReducer } from './pages/backoffice/UserDetails/reducer';
import { patronLoansReducer } from './pages/backoffice/UserDetails/components/PatronLoans/reducer';
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

import { bookDetailsReducer } from './pages/frontsite/BookDetails/reducer';

const rootReducer = combineReducers({
  documentDetails: documentDetailsReducer,
  documentPendingLoans: documentPendingLoans,
  documentItems: documentItems,
  itemDetails: itemDetailsReducer,
  itemPastLoans: itemPastLoansReducer,
  loanDetails: loanDetailsReducer,
  userDetails: userDetailsReducer,
  patronLoans: patronLoansReducer,
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
});

const composeEnhancers = composeWithDevTools({
  name: 'ILS Backoffice',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
