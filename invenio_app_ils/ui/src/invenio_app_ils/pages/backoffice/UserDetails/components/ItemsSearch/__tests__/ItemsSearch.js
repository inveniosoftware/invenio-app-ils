import React from 'react';
import { shallow, mount } from 'enzyme';
import ItemsSearch from '../ItemsSearch';
import { invenioConfig } from '../../../../../../common/config';
import { invenioConfig as config_mock } from '../../../../../../common/__mocks__/config';

describe('PatronLoans tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  invenioConfig['circulation'] = {
    loanActiveStates: config_mock.circulation.loanActiveStates,
  };
  invenioConfig['items'] = {
    available: {
      status: config_mock.items.available.status,
    },
  };

  it('should load the ItemsSearch component', () => {
    const mockedFetchItems = jest.fn();
    const mockedFetchCurrent = jest.fn();
    const mockedUpdateString = jest.fn();
    const mockedClear = jest.fn();
    const mockedCheckoutItem = jest.fn();

    const component = shallow(
      <ItemsSearch
        history={() => {}}
        items={{ hits: [] }}
        queryString={''}
        updateQueryString={mockedUpdateString}
        fetchItems={mockedFetchItems}
        fetchPatronCurrentLoans={mockedFetchCurrent}
        clearResults={mockedClear}
        checkoutItem={mockedCheckoutItem}
        patron={'2'}
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

    const items = {
      hits: [
        { item_pid: '4', barcode: '3', document_pid: '4', status: 'LOANABLE' },
      ],
    };
    component = mount(
      <ItemsSearch
        history={() => {}}
        items={items}
        queryString={''}
        updateQueryString={mockedUpdateString}
        fetchItems={mockedFetchItems}
        fetchPatronCurrentLoans={mockedFetchCurrent}
        clearResults={mockedClear}
        checkoutItem={mockedCheckoutItem}
        patron={'2'}
      />
    );

    expect(component).toMatchSnapshot();
    const tableRow = component
      .find('TableRow')
      .filterWhere(
        element => element.prop('data-test') === items.hits[0].item_pid
      );
    expect(tableRow).toHaveLength(1);
  });
});
