import React from 'react';
import { shallow, mount } from 'enzyme';
import * as testData from '../../../../../../../../../tests/data/documents.json';

import { DocumentsSearch } from '../index';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { InvenioSearchApi, ReactSearchKit } from 'react-searchkit';
import { document as documentApi } from '../../../../../common/api';
import { BrowserRouter } from 'react-router-dom';

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

describe('DocumentsSearch tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const layoutToggleMock = jest.fn();

  it('should load the DocumentsSearch component', () => {
    const component = shallow(
      <DocumentsSearch layoutToggle={layoutToggleMock} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should mount DocumentsSearch component', () => {
    component = mount(
      <BrowserRouter>
        <Provider store={store}>
          <ReactSearchKit searchApi={searchApi}>
            <DocumentsSearch layoutToggle={layoutToggleMock} />
          </ReactSearchKit>
        </Provider>
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
  });
});
