import testData from '@testData/items.json';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ItemDetails from '../ItemDetails';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../components/', () => {
  return {
    ItemMetadata: () => null,
    ItemCirculation: () => null,
    ItemPastLoans: () => null,
    ItemActionMenu: () => null,
  };
});

jest.mock('../../ItemDetails/', () => {
  return {
    ItemHeader: () => null,
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

describe('ItemDetails tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const routerHistory = {
    listen: () => () => {},
  };
  const routerUrlParams = {
    params: {
      itemPid: 111,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <ItemDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchItemDetails={() => {}}
        deleteItem={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch item details on mount', () => {
    const mockedFetchItemDetails = jest.fn();
    component = mount(
      <BrowserRouter>
        <Provider store={store}>
          <ItemDetails
            history={routerHistory}
            match={routerUrlParams}
            fetchItemDetails={mockedFetchItemDetails}
            data={{ metadata: testData[0] }}
            deleteItem={() => {}}
          />
        </Provider>
      </BrowserRouter>
    );
    expect(mockedFetchItemDetails).toHaveBeenCalledWith(
      routerUrlParams.params.itemPid
    );
  });
});
