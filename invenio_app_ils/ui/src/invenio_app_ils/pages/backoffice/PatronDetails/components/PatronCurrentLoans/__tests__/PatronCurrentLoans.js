import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import PatronCurrentLoans from '../PatronCurrentLoans';
import history from '../../../../../../history';
import testData from '../../../../../../../../../../tests/data/loans.json';

jest.mock('../../../../../../common/config/invenioConfig');

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
      <PatronCurrentLoans
        data={{ hits: [], total: 0 }}
        loanState=""
        patronPid={patron.pid}
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no user loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <PatronCurrentLoans
        patronPid={patron.pid}
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
      <PatronCurrentLoans
        patronPid={patron.pid}
        data={data}
        loanState=""
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
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

  it('should render the see all button when showing only a few patron loans', () => {
    const mockedFetchPatronLoans = jest.fn();

    component = mount(
      <PatronCurrentLoans
        patronPid={patron.pid}
        data={data}
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
        showMaxLoans={1}
      />
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });

  it('should go to loan details when clicking on a patron loan', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;

    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <PatronCurrentLoans
        patronPid={patron.pid}
        data={data}
        loanState=""
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
        showMaxLoans={1}
      />
    );

    const firstId = data.hits[0].pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('i');
    button.simulate('click');

    const expectedParam = BackOfficeRoutes.loanDetailsFor(firstId);
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam, {});
  });
});
