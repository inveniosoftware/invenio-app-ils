import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from '../App';
import configureMockStore from 'redux-mock-store';
import { initialState as notificationsInitialState } from '../common/components/Notifications/state/reducer';

jest.mock('../common/config/invenioConfig');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let store;
beforeEach(() => {
  window.history.pushState({}, 'Backoffice page title', '/backoffice');
  store = mockStore({
    notifications: {
      ...notificationsInitialState,
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
