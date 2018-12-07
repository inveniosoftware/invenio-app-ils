import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { userSessionReducer } from './common/components/UserSession/reducer';
import { patronLoansTableReducer } from './pages/UserDetails/components/PatronLoansTable/reducer';
import {
  itemDetailsReducer,
  itemPendingLoansReducer,
} from './pages/ItemDetails/reducer';
import { loanDetailsReducer } from './pages/LoanDetails/reducer';
import { userDetailsReducer } from './pages/UserDetails/reducer';

const rootReducer = combineReducers({
  userSession: userSessionReducer,
  itemDetails: itemDetailsReducer,
  itemPendingLoans: itemPendingLoansReducer,
  patronLoansTable: patronLoansTableReducer,
  loanDetails: loanDetailsReducer,
  userDetails: userDetailsReducer,
});

const composeEnhancers = composeWithDevTools({
  name: 'ILS Backoffice',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
