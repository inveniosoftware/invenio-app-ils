import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '@routes/urls';
import DocumentPendingLoans from '../DocumentPendingLoans';
import history from '@history';
import testData from '../../../../../../../../tests/data/loans.json';
import { Button } from 'semantic-ui-react';

jest.mock('react-router-dom');
jest.mock('@config/invenioConfig');
let mockViewDetails = jest.fn();

BackOfficeRoutes.loanDetailsFor = jest.fn(pid => `loan/${pid}`);
BackOfficeRoutes.patronDetailsFor = jest.fn(pid => `patron/${pid}`);

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

describe('DocumentPendingLoans tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const doc = {
    pid: 111,
    metadata: {
      pid: 111,
      item_pid: 222,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <DocumentPendingLoans
        document={doc}
        data={{ hits: [], total: 0 }}
        fetchPendingLoans={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch pending loans on mount', () => {
    const mockedFetchPendingLoans = jest.fn();
    component = mount(
      <DocumentPendingLoans
        document={doc}
        data={{ hits: [], total: 0 }}
        fetchPendingLoans={mockedFetchPendingLoans}
      />
    );
    expect(mockedFetchPendingLoans).toHaveBeenCalledWith(doc.pid);
  });

  it('should render show a message with no pending loans', () => {
    component = mount(
      <DocumentPendingLoans
        document={doc}
        data={{ hits: [], total: 0 }}
        fetchPendingLoans={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render pending loans', () => {
    component = mount(
      <DocumentPendingLoans
        document={doc}
        data={data}
        fetchPendingLoans={() => {}}
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

  it('should render the see all button when showing only a few pending loans', () => {
    component = mount(
      <DocumentPendingLoans
        document={doc}
        data={data}
        fetchPendingLoans={() => {}}
        showMaxPendingLoans={1}
      />
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });

  it('should go to loan details when clicking on a pending loan', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;

    component = mount(
      <DocumentPendingLoans
        document={doc}
        data={data}
        fetchPendingLoans={() => {}}
        showMaxPendingLoans={1}
      />
    );
    component.instance().viewDetails = jest.fn(() => (
      <Button onClick={mockViewDetails}></Button>
    ));
    component.instance().forceUpdate();

    const firstId = data.hits[0].pid;
    component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `0-${firstId}`)
      .find('Button')
      .simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });
});
