import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { userSessionReducer } from './common/components/UserSession/reducer';
import { itemDetailsReducer } from './pages/ItemDetails/reducer';
import { loanDetailsReducer } from './pages/LoanDetails/reducer';

const rootReducer = combineReducers({
  userSession: userSessionReducer,
  itemDetails: itemDetailsReducer,
  loanDetails: loanDetailsReducer,
});

const composeEnhancers = composeWithDevTools({
  name: 'ILS Backoffice',
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
