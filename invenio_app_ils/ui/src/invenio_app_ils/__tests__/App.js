import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from '../App';
import configureMockStore from 'redux-mock-store';
import { initialState as notificationsInitialState } from '../common/components/Notifications/state/reducer';
import { initialState as mostRecentBooksInitialState } from '../pages/frontsite/Home/components/MostRecentBooks/state/reducer';
import { initialState as mostLoanedBooksInitialState } from '../pages/frontsite/Home/components/MostLoanedBooks/state/reducer';
import { initialState as mostRecentEbooksInitialState } from '../pages/frontsite/Home/components/MostRecentEbooks/state/reducer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../common/config');

let store;
beforeEach(() => {
  window.history.pushState({}, 'Backoffice page title', '/backoffice');
  store = mockStore({
    notifications: {
      ...notificationsInitialState,
    },
    mostLoanedBooks: {
      ...mostLoanedBooksInitialState,
    },
    mostRecentBooks: {
      ...mostRecentBooksInitialState,
    },
    mostRecentEbooks: {
      ...mostRecentEbooksInitialState,
    },
  });
  store.clearActions();
});

it('should render backoffice application', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
