import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { itemListReducer } from './pages/ItemList/reducer';
import { itemDetailsReducer } from './pages/ItemDetails/reducer';
import { loanListReducer } from './pages/LoanList/reducer';
import { loanDetailsReducer } from './pages/LoanDetails/reducer';

const rootReducer = combineReducers({
  itemList: itemListReducer,
  itemDetails: itemDetailsReducer,
  loanList: loanListReducer,
  loanDetails: loanDetailsReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
