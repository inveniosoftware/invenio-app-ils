import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '@routes/urls';
import { BrowserRouter } from 'react-router-dom';
import PatronPendingLoans from '../PatronPendingLoans';
import testData from '@testData/loans.json';
import documentTestData from '@testData/documents.json';
import { Button } from 'semantic-ui-react';

jest.mock('@config/invenioConfig');
BackOfficeRoutes.loanDetailsFor = jest.fn(pid => `url/${pid}`);
BackOfficeRoutes.documentDetailsFor = jest.fn(pid => `url/${pid}`);
let mockViewDetails = jest.fn();

const data = {
  hits: [
    {
      id: 1,
      pid: 'loan1',
      metadata: {
        ...testData[0],
        document: {
          ...documentTestData[0],
        },
      },
    },
    {
      id: 2,
      pid: 'loan2',
      metadata: {
        ...testData[1],
        document: {
          ...documentTestData[0],
        },
      },
    },
  ],
  total: 2,
};

describe('PatronLoans tests', () => {
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
    const mockedFetchPatronLoans = jest.fn();

    const component = shallow(
      <PatronPendingLoans
        data={{ hits: [], total: 0 }}
        loanState=""
        patronDetails={patron}
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
          patronDetails={patron}
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
          patronDetails={patron}
          data={data}
          loanState=""
          fetchPatronPendingLoans={mockedFetchPatronLoans}
        />
      </BrowserRouter>
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

  it('should render the see all button when showing only a few patron loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronPendingLoans
          patronDetails={patron}
          data={data}
          fetchPatronPendingLoans={mockedFetchPatronLoans}
          showMaxLoans={1}
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
    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronPendingLoans
          patronDetails={patron}
          data={data}
          loanState=""
          fetchPatronPendingLoans={mockedFetchPatronLoans}
          showMaxLoans={1}
        />
      </BrowserRouter>
    );

    const firstId = data.hits[0].pid;
    component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `0-${firstId}`)
      .find('Link')
      .simulate('click');
    expect(BackOfficeRoutes.loanDetailsFor).toHaveBeenCalled();
  });
});
