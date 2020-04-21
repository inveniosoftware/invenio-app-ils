import React from 'react';
import { shallow, mount } from 'enzyme';
import PatronCurrentBorrowingRequests from '../PatronCurrentBorrowingRequests';
import testData from '@testData/ill_borrowing_requests.json';
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
      pid: 'borrowing_request1',
      metadata: {
        ...testData[0],
        document_pid: '5',
        document: {
          title: 'Test',
        },
      },
    },
    {
      id: 2,
      pid: 'borrowing_request2',
      metadata: {
        ...testData[1],
        document_pid: '6',
        document: {
          title: 'Test 2',
        },
      },
    },
  ],
  total: 2,
};

describe('PatronBorrowingRequests tests', () => {
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
      <PatronCurrentBorrowingRequests
        data={{ hits: [], total: 0 }}
        loanState=""
        patronPid={patron.pid}
        fetchPatronCurrentBorrowingRequests={mockedFetchPatronLoans}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no user loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronCurrentBorrowingRequests
          patronPid={patron.pid}
          data={{ hits: [], total: 0 }}
          loanState=""
          fetchPatronCurrentBorrowingRequests={mockedFetchPatronLoans}
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
        <PatronCurrentBorrowingRequests
          patronPid={patron.pid}
          data={data}
          loanState=""
          fetchPatronCurrentBorrowingRequests={mockedFetchPatronLoans}
        />
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
    const rows = component
      .find('Item')
      .filterWhere(
        element =>
          element.prop('data-test') === 'illbid-1' ||
          element.prop('data-test') === 'illbid-2'
      );
    expect(rows).toHaveLength(2);
  });
});
