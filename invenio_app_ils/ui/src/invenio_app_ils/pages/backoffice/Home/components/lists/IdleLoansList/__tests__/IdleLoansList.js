import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import IdleLoansList from '../IdleLoansList';
import testData from '../../../../../../../../../../../tests/data/loans.json';
import { Button } from 'semantic-ui-react';

jest.mock('react-router-dom');
jest.mock('../../../../../../../common/config/invenioConfig');
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

let component;
afterEach(() => {
  if (component) {
    mockViewDetails.mockClear();
    component.unmount();
  }
});

describe('IdleLoansList tests', () => {
  it('should load the details component', () => {
    const component = shallow(
      <IdleLoansList
        data={{ hits: [], total: 0 }}
        fetchIdlePendingLoans={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch loans on mount', () => {
    const mockedFetchLoans = jest.fn();
    component = mount(
      <IdleLoansList
        data={{ hits: [], total: 0 }}
        fetchIdlePendingLoans={mockedFetchLoans}
      />
    );
    expect(mockedFetchLoans).toHaveBeenCalled();
  });

  it('should render show a message with no loans', () => {
    component = mount(
      <IdleLoansList
        data={{ hits: [], total: 0 }}
        fetchIdlePendingLoans={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render loans', () => {
    component = mount(
      <IdleLoansList data={data} fetchIdlePendingLoans={() => {}} />
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

  it('should go to loan details when clicking on a loan', () => {
    component = mount(
      <IdleLoansList
        data={data}
        fetchIdlePendingLoans={() => {}}
        showMaxEntries={1}
      />
    );

    component.instance().viewDetails = jest.fn(() => (
      <Button onClick={mockViewDetails}></Button>
    ));
    component.instance().forceUpdate();

    const firstId = data.hits[0].pid;
    const button = component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `-${firstId}`)
      .find('Button');
    button.simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });
});
