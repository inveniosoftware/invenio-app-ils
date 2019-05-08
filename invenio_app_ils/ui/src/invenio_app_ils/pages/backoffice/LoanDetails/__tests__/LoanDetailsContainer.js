import React from 'react';
import { shallow, mount } from 'enzyme';
import LoanDetailsContainer from '../LoanDetailsContainer';

jest.mock('../../../../common/config');

jest.mock('../components/LoanDetails', () => {
  return {
    LoanDetails: () => null,
  };
});

describe('LoanDetailsContainer tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const routerHistory = {
    listen: () => () => {},
  };
  const routerUrlParams = {
    params: {
      loanPid: 879,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <LoanDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchLoanDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch loan details on mount', () => {
    const mockedFetchLoanDetails = jest.fn();
    component = mount(
      <LoanDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchLoanDetails={mockedFetchLoanDetails}
      />
    );
    expect(mockedFetchLoanDetails).toHaveBeenCalledWith(
      routerUrlParams.params.loanPid
    );
  });
});
