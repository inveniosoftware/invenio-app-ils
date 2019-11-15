import React from 'react';
import { shallow, mount } from 'enzyme';
import PatronPendingLoans from '../PatronPendingLoans';
import testData from '@testData/loans.json';
import { BrowserRouter } from 'react-router-dom';
import { fromISO } from '@api/date';
import { Settings } from 'luxon';
Settings.defaultZoneName = 'utc';

jest.mock('@config');

testData[0].request_expire_date = fromISO(testData[0].request_expire_date);
testData[1].request_expire_date = fromISO(testData[1].request_expire_date);
testData[0].request_start_date = fromISO(testData[0].request_start_date);
testData[1].request_start_date = fromISO(testData[1].request_start_date);

const data = {
  hits: [
    {
      id: 1,
      pid: 'loan1',
      metadata: {
        ...testData[0],
        document: {
          title: 'Test',
          pid: '5',
          circulation: {
            has_items_on_site: 0,
          },
        },
      },
    },
    {
      id: 2,
      pid: 'loan2',
      metadata: {
        ...testData[1],
        document: {
          title: 'Test 2',
          pid: '6',
          circulation: {
            has_items_on_site: 0,
          },
        },
      },
    },
  ],
  total: 2,
};

describe('PatronLoans tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const patron = {
    pid: '2',
  };

  it('should load the details component', () => {
    const mockedFetchPatronLoans = jest.fn();

    const component = shallow(
      <PatronPendingLoans
        data={{ hits: [], total: 0 }}
        loanState=""
        patronPid={patron.pid}
        fetchPatronPendingLoans={mockedFetchPatronLoans}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no user loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronPendingLoans
          patronPid={patron.pid}
          data={{ hits: [], total: 0 }}
          loanState=""
          fetchPatronPendingLoans={mockedFetchPatronLoans}
        />
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render patron loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronPendingLoans
          patronPid={patron.pid}
          data={data}
          loanState=""
          fetchPatronPendingLoans={mockedFetchPatronLoans}
        />
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
    const rows = component
      .find('Item')
      .filterWhere(
        element =>
          element.prop('data-test') === 'loanid-1' ||
          element.prop('data-test') === 'loanid-2'
      );
    expect(rows).toHaveLength(2);
  });
});
