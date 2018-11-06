import React from 'react';
import { mount } from 'enzyme';
import LoanDetails from '../LoanDetails';
import { LoanMetadata } from '../../LoanMetadata/LoanMetadata';
import { LoanActions } from '../../LoanActions/LoanActions';

const defaultProps = {
  data: {
    loan_id: 42,
    metadata: {
      title: 'title',
    },
    availableActions: {
      action: 'action',
    },
  },
  isLoading: false,
  actionLoading: false,
  loanActionError: false,
  postLoanAction: () => 'postLoanAction',
};

describe('LoanDetails', () => {
  let component;
  afterEach(() => {
    component.unmount();
  });

  it('should render two top level nodes, Metadata and Actions', () => {
    component = mount(
      <LoanDetails {...defaultProps} onAction={defaultProps.postLoanAction} />
    );
    const metadata = component.find(LoanMetadata);
    const actions = component.find(LoanActions);
    expect(metadata.exists()).toEqual(true);
    expect(actions.exists()).toEqual(true);
  });

  it('should render correctly with props', () => {
    component = mount(
      <LoanDetails {...defaultProps} onAction={defaultProps.postLoanAction} />
    );
    expect(component).toMatchSnapshot();
  });
});
