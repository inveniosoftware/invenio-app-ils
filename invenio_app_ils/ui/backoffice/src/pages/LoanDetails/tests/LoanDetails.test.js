import React from 'react';
import { shallow, render } from 'enzyme';
import LoanDetails from '../LoanDetails';

describe('tests the LoanDetails component', () => {
  it('renders the loader component when fetching is in progress', () => {
    let props = {
      data: {},
      error: {},
      fetchLoading: true,
      actionLoading: false,
      loanActionError: false,
      fetchLoanDetails: () => 'fetchLoanDetails',
      postLoanAction: () => 'postLoanAction',
    };
    let component = render(<LoanDetails {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('renders a message when fetching fails', () => {
    let props = {
      data: {},
      error: {},
      fetchLoading: false,
      actionLoading: false,
      loanActionError: true,
      fetchLoanDetails: () => 'fetchLoanDetails',
      postLoanAction: () => 'postLoanAction',
    };
    let component = render(<LoanDetails {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('renders the details page when fetching succeeds', () => {
    let props = {
      data: {
        metadata: {
          title: 'title',
        },
        availableActions: {
          action: 'action',
        },
      },
      error: {
        message: 'error',
      },
      fetchLoading: false,
      actionLoading: false,
      loanActionError: false,
      fetchLoanDetails: () => 'fetchLoanDetails',
      postLoanAction: () => 'postLoanAction',
    };
    let component = render(<LoanDetails {...props} />);
    expect(component).toMatchSnapshot();
  });
});
