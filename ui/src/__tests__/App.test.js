import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from '../App';
import configureMockStore from 'redux-mock-store';
import { initialState as notificationsInitialState } from '../components/Notifications/state/reducer';
import { initialState as authenticationManagementInitialState } from '@authentication/state/reducer';

jest.mock('@config/invenioConfig');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let store;
beforeEach(() => {
  window.history.pushState({}, 'Backoffice page title', '/backoffice');
  store = mockStore({
    notifications: {
      ...notificationsInitialState,
    },
    authenticationManagement: {
      ...authenticationManagementInitialState,
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
