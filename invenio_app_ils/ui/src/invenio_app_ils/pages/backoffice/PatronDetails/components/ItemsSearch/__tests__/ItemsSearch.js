import React from 'react';
import { shallow, mount } from 'enzyme';
import ItemsSearch from '../ItemsSearch';
import { invenioConfig } from '../../../../../../common/config';
import { invenioConfig as configMock } from '../../../../../../common/__mocks__/config';
import { fromISO } from '../../../../../../common/api/date';
import { Settings } from 'luxon';

jest.mock('../../../../../../common/config');

Settings.defaultZoneName = 'utc';

const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('PatronLoans tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  invenioConfig['circulation'] = {
    loanActiveStates: configMock.circulation.loanActiveStates,
  };
  invenioConfig['items'] = {
    available: {
      status: configMock.items.available.status,
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
        items={{ hits: [] }}
        queryString={''}
        updateQueryString={mockedUpdateString}
        fetchItems={mockedFetchItems}
        fetchUpdatedCurrentLoans={mockedFetchCurrent}
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
        {
          id: '1',
          updated: stringDate,
          created: stringDate,
          item_pid: 'item1',
          metadata: {
            document_pid: 'doc1',
            item_pid: 'item1',
            internal_location: { location: { name: 'Somewhere' } },
            barcode: '44444',
            shelf: 'P',
            status: 'CAN_CIRCULATE',
            circulation_status: {},
            medium: 'book',
          },
        },
      ],
      total: 1,
    };

    component = mount(
      <ItemsSearch
        items={items}
        queryString={''}
        updateQueryString={mockedUpdateString}
        fetchItems={mockedFetchItems}
        fetchUpdatedCurrentLoans={mockedFetchCurrent}
        clearResults={mockedClear}
        checkoutItem={mockedCheckoutItem}
        patron={2}
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
