import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { documentItemsReducer } from './pages/backoffice/LoanDetails/reducer';
import {
  itemDetailsReducer,
  itemPendingLoansReducer,
} from './pages/backoffice/ItemDetails/reducer';
import { loanDetailsReducer } from './pages/backoffice/LoanDetails/reducer';
import { patronLoansTableReducer } from './pages/backoffice/UserDetails/components/PatronLoansTable/reducer';
import { userDetailsReducer } from './pages/backoffice/UserDetails/reducer';
import { userSessionReducer } from './common/components/UserSession/reducer';

const rootReducer = combineReducers({
  userSession: userSessionReducer,
  itemDetails: itemDetailsReducer,
  itemPendingLoans: itemPendingLoansReducer,
  loanDetails: loanDetailsReducer,
  userDetails: userDetailsReducer,
  patronLoansTable: patronLoansTableReducer,
  documentItems: documentItemsReducer,
});

const composeEnhancers = composeWithDevTools({
  name: 'ILS Backoffice',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
