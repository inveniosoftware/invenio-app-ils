import React from 'react';
import { shallow } from 'enzyme';
import { LoanDetails } from '../LoanDetails';

const defaultProps = {
  data: {},
  actionLoading: false,
  loanActionError: false,
  postLoanAction: () => 'postLoanAction',
};

describe('LoanDetails', () => {
  it('should render correctly without props', () => {
    const component = shallow(<LoanDetails />);
    expect(component).toMatchSnapshot();
  });

  it('should render correctly with props', () => {
    const component = shallow(<LoanDetails {...defaultProps} />);
    expect(component).toMatchSnapshot();
  });
});
