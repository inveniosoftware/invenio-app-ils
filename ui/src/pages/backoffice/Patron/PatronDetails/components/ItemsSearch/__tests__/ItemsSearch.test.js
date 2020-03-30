import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ItemsSearch from '../ItemsSearch';
import { fromISO } from '@api/date';
import { Settings } from 'luxon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('@config/invenioConfig');

Settings.defaultZoneName = 'utc';

const stringDate = fromISO('2018-01-01T11:05:00+01:00');

const items = {
  hits: [
    {
      id: '1',
      updated: stringDate,
      created: stringDate,
      pid: 'item1',
      metadata: {
        document_pid: 'doc1',
        pid: 'item1',
        internal_location: { location: { name: 'Somewhere' } },
        barcode: '44444',
        shelf: 'P',
        status: 'CAN_CIRCULATE',
        circulation: {},
        medium: 'book',
        document: {
          title: 'Here is a title',
        },
      },
    },
  ],
  total: 1,
};

let store;
beforeEach(() => {
  store = mockStore({
    isLoading: false,
    data: items,
    results: items,
    hasError: false,
    patronItemsCheckout: () => {},
    itemsSearchInput: {
      data: items,
    },
  });
  store.clearActions();
});

describe('PatronLoans tests', () => {
  let component;

  const patron = {
    user_pid: '2',
    name: 'Name',
    email: 'name@test.ch',
  };

  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the ItemsSearch component', () => {
    const mockedFetchItems = jest.fn();
    const mockedFetchCurrent = jest.fn();
    const mockedUpdateString = jest.fn();
    const mockedClear = jest.fn();
    const mockedCheckoutItem = jest.fn();

    const component = shallow(
      <ItemsSearch
        items={{ hits: [] }}
        queryString={''}
        updateQueryString={mockedUpdateString}
        fetchItems={mockedFetchItems}
        fetchUpdatedCurrentLoans={mockedFetchCurrent}
        clearResults={mockedClear}
        checkoutItem={mockedCheckoutItem}
        patronDetails={patron}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render items in search', () => {
    const mockedFetchItems = jest.fn();
    const mockedFetchCurrent = jest.fn();
    const mockedUpdateString = jest.fn();
    const mockedClear = jest.fn();
    const mockedCheckoutItem = jest.fn();

    component = mount(
      <BrowserRouter>
        <Provider store={store}>
          <ItemsSearch
            items={items}
            queryString={'searched'}
            updateQueryString={mockedUpdateString}
            fetchItems={mockedFetchItems}
            fetchUpdatedCurrentLoans={mockedFetchCurrent}
            clearResults={mockedClear}
            checkoutItem={mockedCheckoutItem}
            patronDetails={patron}
          />
        </Provider>
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
    const tableRow = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === items.hits[0].pid);
    expect(tableRow).toHaveLength(1);
  });
});
