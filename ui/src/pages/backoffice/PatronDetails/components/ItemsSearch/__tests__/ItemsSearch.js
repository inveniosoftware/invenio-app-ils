import React from 'react';
import { shallow, mount } from 'enzyme';
import ItemsSearch from '../ItemsSearch';
import { fromISO } from '@api/date';
import { Settings } from 'luxon';

jest.mock('@config/invenioConfig');

Settings.defaultZoneName = 'utc';

const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('PatronLoans tests', () => {
  let component;
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
        patronPid={'2'}
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

    component = mount(
      <ItemsSearch
        items={items}
        queryString={''}
        updateQueryString={mockedUpdateString}
        fetchItems={mockedFetchItems}
        fetchUpdatedCurrentLoans={mockedFetchCurrent}
        clearResults={mockedClear}
        checkoutItem={mockedCheckoutItem}
        patronPid={'2'}
      />
    );

    expect(component).toMatchSnapshot();
    const tableRow = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === items.hits[0].pid);
    expect(tableRow).toHaveLength(1);
  });
});
