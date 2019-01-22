import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { availableItemsReducer } from './pages/backoffice/LoanDetails/reducer';
import {
  itemDetailsReducer,
  itemPendingLoansReducer,
  itemPastLoansReducer,
} from './pages/backoffice/ItemDetails/reducer';
import { loanDetailsReducer } from './pages/backoffice/LoanDetails/reducer';
import { userDetailsReducer } from './pages/backoffice/UserDetails/reducer';
import { patronLoansReducer } from './pages/backoffice/UserDetails/components/PatronLoans/reducer';
import { userSessionReducer } from './common/components/UserSession/reducer';

const rootReducer = combineReducers({
  userSession: userSessionReducer,
  itemDetails: itemDetailsReducer,
  itemPastLoans: itemPastLoansReducer,
  itemPendingLoans: itemPendingLoansReducer,
  loanDetails: loanDetailsReducer,
  userDetails: userDetailsReducer,
  patronLoans: patronLoansReducer,
  availableItems: availableItemsReducer,
});

const composeEnhancers = composeWithDevTools({
  name: 'ILS Backoffice',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
