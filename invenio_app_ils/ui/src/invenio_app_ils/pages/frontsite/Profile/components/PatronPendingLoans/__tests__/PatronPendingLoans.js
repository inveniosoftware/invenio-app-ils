import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../common/api/date';
import PatronPendingLoans from '../PatronPendingLoans';

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

  const patron = {
    patron_pid: '2',
  };

  it('should load the details component', () => {
    const mockedFetchPatronLoans = jest.fn();

    const component = shallow(
      <PatronPendingLoans
        data={{ hits: [], total: 0 }}
        loanState=""
        patron={patron.patron_pid}
        fetchPatronPendingLoans={mockedFetchPatronLoans}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no user loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <PatronPendingLoans
        patron={patron.patron_pid}
        data={{ hits: [], total: 0 }}
        loanState=""
        fetchPatronPendingLoans={mockedFetchPatronLoans}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render patron loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    const data = {
      hits: [
        {
          id: 1,
          updated: stringDate,
          created: stringDate,
          loan_pid: 'loan1',
          metadata: {
            loan_pid: 'loan1',
            document_pid: 'doc1',
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
            document_pid: 'doc1',
            patron_pid: 'patron_2',
            start_date: stringDate,
            end_date: stringDate,
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <PatronPendingLoans
        patron={patron.patron_pid}
        data={data}
        loanState=""
        fetchPatronPendingLoans={mockedFetchPatronLoans}
      />
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
