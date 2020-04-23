import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes, ILLRoutes } from '@routes/urls';
import { BrowserRouter } from 'react-router-dom';
import PatronPastBorrowingRequests from '../PatronPastBorrowingRequests';
import testData from '@testData/ill_borrowing_requests.json';
import libraryTestData from '@testData/ill_libraries.json';
import documentTestData from '@testData/documents.json';

jest.mock('@config/invenioConfig');
ILLRoutes.borrowingRequestDetailsFor = jest.fn(pid => `url/${pid}`);
BackOfficeRoutes.documentDetailsFor = jest.fn(pid => `url/${pid}`);
let mockViewDetails = jest.fn();

const data = {
  hits: [
    {
      id: 1,
      pid: 'borrowing-request1',
      metadata: {
        ...testData[0],
        library: { ...libraryTestData[0] },
        document: {
          ...documentTestData[0],
        },
      },
    },
    {
      id: 2,
      pid: 'borrowing-request2',
      metadata: {
        ...testData[1],
        library: { ...libraryTestData[1] },
        document: {
          ...documentTestData[0],
        },
      },
    },
  ],
  total: 2,
};

describe('PatronPastBorrowingRequests tests', () => {
  let component;
  afterEach(() => {
    mockViewDetails.mockClear();
    if (component) {
      component.unmount();
    }
  });

  const patron = {
    user_pid: '2',
  };

  it('should load the details component', () => {
    const mockedFetchPatronPastBorrowingRequests = jest.fn();

    const component = shallow(
      <PatronPastBorrowingRequests
        data={{ hits: [], total: 0 }}
        loanState=""
        patronDetails={patron}
        fetchPatronPastBorrowingRequests={
          mockedFetchPatronPastBorrowingRequests
        }
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no user borrowing requests', () => {
    const mockedFetchPatronPastBorrowingRequests = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronPastBorrowingRequests
          patronDetails={patron}
          data={{ hits: [], total: 0 }}
          loanState=""
          fetchPatronPastBorrowingRequests={
            mockedFetchPatronPastBorrowingRequests
          }
        />
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render patron borrowing requests', () => {
    const mockedFetchPatronPastBorrowingRequests = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronPastBorrowingRequests
          patronDetails={patron}
          data={data}
          loanState=""
          fetchPatronPastBorrowingRequests={
            mockedFetchPatronPastBorrowingRequests
          }
        />
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
    const rows = component
      .find('TableRow')
      .filterWhere(
        element =>
          element.prop('data-test') === 'borrowing-request1' ||
          element.prop('data-test') === 'borrowing-request2'
      );
    expect(rows).toHaveLength(2);

    const footer = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should render the see all button when showing only a few patron borrowing requests', () => {
    const mockedFetchPatronPastBorrowingRequests = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronPastBorrowingRequests
          patronDetails={patron}
          data={data}
          fetchPatronPastBorrowingRequests={
            mockedFetchPatronPastBorrowingRequests
          }
          showMaxRequests={1}
        />
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });

  it('should go to loan details when clicking on a patron loan', () => {
    const mockedFetchPatronPastBorrowingRequests = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronPastBorrowingRequests
          patronDetails={patron}
          data={data}
          loanState=""
          fetchPatronPastBorrowingRequests={
            mockedFetchPatronPastBorrowingRequests
          }
          showMaxRequests={1}
        />
      </BrowserRouter>
    );

    const firstId = data.hits[0].pid;
    component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `0-${firstId}`)
      .find('Link')
      .simulate('click');
    expect(ILLRoutes.borrowingRequestDetailsFor).toHaveBeenCalled();
  });
});
