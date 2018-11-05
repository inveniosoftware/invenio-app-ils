import React from 'react';
import { mount } from 'enzyme';
import { Message } from 'semantic-ui-react';
import { LoanDetails } from '../LoanDetails';
import { LoanMetadata } from '../../LoanMetadata/LoanMetadata';
import { LoanActions } from '../../LoanActions/LoanActions';

const defaultProps = {
  data: {},
  isLoading: true,
  actionLoading: false,
  loanActionError: false,
  fetchLoanDetails: () => 'fetchLoanDetails',
  postLoanAction: () => 'postLoanAction',
};

describe('LoanDetails', () => {
  let component;

  // beforeAll(() => {
  //   // omit `componentDidMount` to skip routing testing
  //   LoanDetails.prototype.componentDidMount = () => {};
  //   LoanDetails.prototype.componentWillUnmount = () => {};
  // });

  afterEach(() => {
    component.unmount();
  });

  it('should render an error when fetch fails', () => {
    let props = {
      ...defaultProps,
      isLoading: false,
      error: {
        message: 'error',
      },
    };
    component = mount(<LoanDetails {...props} />);
    expect(component).toMatchSnapshot();

    const metadata = component.find(LoanMetadata);
    const actions = component.find(LoanActions);
    const message = component.find(Message);
    expect(metadata.exists()).toEqual(false);
    expect(actions.exists()).toEqual(false);
    expect(message.exists()).toEqual(true);
  });

  it('should render metadata and actions when fetch succeeds', () => {
    let props = {
      ...defaultProps,
      data: {
        metadata: {
          title: 'title',
        },
        availableActions: {
          action: 'action',
        },
      },
      isLoading: false,
    };
    component = mount(<LoanDetails {...props} />);
    expect(component).toMatchSnapshot();

    const metadata = component.find(LoanMetadata);
    const actions = component.find(LoanActions);
    const message = component.find(Message);
    expect(metadata.exists()).toEqual(true);
    expect(actions.exists()).toEqual(true);
    expect(message.exists()).toEqual(false);
  });
});
