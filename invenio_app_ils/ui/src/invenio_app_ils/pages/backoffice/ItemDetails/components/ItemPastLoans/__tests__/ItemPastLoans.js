import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../common/api/date';
import ItemPastLoans from '../ItemPastLoans';

jest.mock('../../../../../../common/config');

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('ItemPastLoans tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const item = {
    item_pid: 222,
    metadata: {
      document_pid: 111,
      item_pid: 222,
    },
  };

  it('should load the past loans component', () => {
    const component = shallow(
      <ItemPastLoans
        itemDetails={item}
        data={{ hits: [], total: 0 }}
        fetchPastLoans={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch past loans on mount', () => {
    const mockedFetchPastLoans = jest.fn();
    component = mount(
      <ItemPastLoans
        itemDetails={item}
        data={{ hits: [], total: 0 }}
        fetchPastLoans={mockedFetchPastLoans}
      />
    );
    expect(mockedFetchPastLoans).toHaveBeenCalledWith(item.item_pid);
  });

  it('should render show a message with no past loans', () => {
    component = mount(
      <ItemPastLoans
        itemDetails={item}
        data={{ hits: [], total: 0 }}
        fetchPastLoans={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render pending loans', () => {
    const data = {
      hits: [
        {
          id: 1,
          updated: stringDate,
          created: stringDate,
          loan_pid: 'loan1',
          metadata: {
            loan_pid: 'loan1',
            patron_pid: 'patron_1',
            start_date: stringDate,
            end_date: stringDate,
          },
        },
        {
          id: 2,
          updated: stringDate,
          created: stringDate,
          loan_pid: 'loan2',
          metadata: {
            loan_pid: 'loan2',
            patron_pid: 'patron_2',
            start_date: stringDate,
            end_date: stringDate,
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <ItemPastLoans itemDetails={item} data={data} fetchPastLoans={() => {}} />
    );

    expect(component).toMatchSnapshot();
    const rows = component
      .find('TableRow')
      .filterWhere(
        element =>
          element.prop('data-test') === 'loan1' ||
          element.prop('data-test') === 'loan2'
      );
    expect(rows).toHaveLength(2);

    const footer = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });
});
