import React from 'react';
import { shallow, mount } from 'enzyme';
import LoanDetails from '../LoanDetails';
import * as testData from '@testData/loans.json';

jest.mock('../../../components/OverdueLoanSendMailModal', () => {
  return {
    OverdueLoanSendMailModal: () => null,
  };
});

jest.mock('../components/', () => {
  return {
    LoanMetadata: () => null,
    CurrentItem: () => null,
    Loan: () => null,
    AvailableItems: () => null,
    LoanActionMenu: () => null,
    LoanHeader: () => null,
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
        data={{ metadata: testData[0] }}
        isLoading={false}
        error={{}}
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
        error={{}}
        data={{ metadata: testData[0] }}
        isLoading={false}
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
