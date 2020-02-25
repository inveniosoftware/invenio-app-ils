import testData from '@testData/eitems.json';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import EItemDetails from '../EItemDetails';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../components/', () => {
  return {
    EItemMetadata: () => null,
    EItemFiles: () => null,
    EItemActionMenu: () => null,
  };
});

jest.mock('../../EItemDetails/', () => {
  return {
    EItemHeader: () => null,
  };
});

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
    itemDetails: data,
  });
  store.clearActions();
});

describe('EItemDetails tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const routerUrlParams = {
    params: {
      eitemPid: 111,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <EItemDetails
        match={routerUrlParams}
        fetchEItemDetails={() => {}}
        isLoading={true}
        deleteEItem={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch eitem details on mount', () => {
    const mockedFetchEItemDetails = jest.fn();
    component = mount(
      <BrowserRouter>
        <Provider store={store}>
          <EItemDetails
            match={routerUrlParams}
            fetchEItemDetails={mockedFetchEItemDetails}
            isLoading={true}
            deleteEItem={() => {}}
          />
        </Provider>
      </BrowserRouter>
    );
    expect(mockedFetchEItemDetails).toHaveBeenCalledWith(
      routerUrlParams.params.eitemPid
    );
  });
});
