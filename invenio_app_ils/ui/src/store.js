import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { bookResultsReducer } from './pages/Home/reducer';
import { bookDetailsReducer } from './pages/BookDetails/reducer';

const rootReducer = combineReducers({
  bookResults: bookResultsReducer,
  bookDetails: bookDetailsReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
