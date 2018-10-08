import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { loanDetailsReducer } from './pages/LoanDetails/reducer';

const rootReducer = combineReducers({
  loanDetails: loanDetailsReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
