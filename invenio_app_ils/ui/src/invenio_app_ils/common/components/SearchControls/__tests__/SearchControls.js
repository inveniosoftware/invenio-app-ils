import React from 'react';
import { shallow, mount } from 'enzyme';
import * as testData from '../../../../../../../../tests/data/documents.json';

import { SearchControls } from '../index';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { InvenioSearchApi, ReactSearchKit } from 'react-searchkit';
import { document as documentApi } from '../../../api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const data = {
  hits: {
    total: 2,
    hits: [{ metadata: testData[0] }, { metadata: testData[1] }],
  },
};

let store;
beforeEach(() => {
  store = mockStore({
    isLoading: false,
    data: data,
    hasError: false,
  });
  store.clearActions();
});

const searchApi = new InvenioSearchApi({
  url: documentApi.searchBaseURL,
  withCredentials: true,
});

describe('SearchControls tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const layoutToggleMock = jest.fn();

  it('should load the SearchControls component', () => {
    const component = shallow(
      <SearchControls layoutToggle={layoutToggleMock} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should mount SearchControls component', () => {
    component = mount(
      <Provider store={store}>
        <ReactSearchKit searchApi={searchApi}>
          <SearchControls layoutToggle={layoutToggleMock} />
        </ReactSearchKit>
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });
});
