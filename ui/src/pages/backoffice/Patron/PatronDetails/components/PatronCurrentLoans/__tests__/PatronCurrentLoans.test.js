import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '@routes/urls';
import { BrowserRouter } from 'react-router-dom';
import PatronCurrentLoans from '../PatronCurrentLoans';
import testData from '@testData/loans.json';
import isEmpty from 'lodash/isEmpty';

jest.mock('@config/invenioConfig');
BackOfficeRoutes.loanDetailsFor = jest.fn(pid => `url/${pid}`);
let mockViewDetails = jest.fn();

const data = {
  hits: [
    {
      id: 1,
      pid: 'loan1',
      metadata: testData[0],
    },
    {
      id: 2,
      pid: 'loan2',
      metadata: testData[1],
    },
  ],
  total: 2,
};

describe('PatronCurrentLoans tests', () => {
  let component;
  afterEach(() => {
    mockViewDetails.mockClear();
    if (!isEmpty(component)) {
      component.unmount();
    }
  });

  const patron = {
    user_pid: '2',
  };

  it('should load the details component', () => {
    const mockedFetchPatronLoans = jest.fn();

    const component = shallow(
      <PatronCurrentLoans
        data={{ hits: [], total: 0 }}
        loanState=""
        patronDetails={patron}
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no user loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <PatronCurrentLoans
        patronDetails={patron}
        data={{ hits: [], total: 0 }}
        loanState=""
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
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
    component = mount(
      <BrowserRouter>
        <PatronCurrentLoans
          patronDetails={patron}
          data={data}
          loanState=""
          fetchPatronCurrentLoans={mockedFetchPatronLoans}
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
        <PatronCurrentLoans
          patronDetails={patron}
          data={data}
          fetchPatronCurrentLoans={mockedFetchPatronLoans}
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
        <PatronCurrentLoans
          patronDetails={patron}
          data={data}
          loanState=""
          fetchPatronCurrentLoans={mockedFetchPatronLoans}
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
