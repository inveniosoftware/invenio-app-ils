import React from 'react';
import { shallow, mount } from 'enzyme';
import LoanDetails from '../LoanDetails';

jest.mock('../components/', () => {
  return {
    LoanMetadata: () => null,
  };
});

describe('LoanDetails tests', () => {
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
      <LoanDetails
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
      <LoanDetails
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
