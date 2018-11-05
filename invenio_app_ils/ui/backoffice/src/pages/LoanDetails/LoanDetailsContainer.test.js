import React from 'react';
import { mount } from 'enzyme';
import { Message } from 'semantic-ui-react';
import { LoanDetailsContainer } from './LoanDetailsContainer';
import { LoanDetails } from './components/LoanDetails/LoanDetails';
import { LoanMetadata } from './components/LoanMetadata/LoanMetadata';
import { LoanActions } from './components/LoanActions/LoanActions';

const defaultProps = {
  data: {},
  error: {},
  isLoading: true,
  fetchLoanDetails: () => 'fetchLoanDetails',
};

describe('LoanDetailsContainer', () => {
  let component;

  afterEach(() => {
    component.unmount();
  });

  it('should render correctly without props', () => {
    component = mount(<LoanDetailsContainer />);
    expect(component).toMatchSnapshot();
  });

  it('should render an error when fetch fails', () => {
    let props = {
      ...defaultProps,
      isLoading: false,
      error: {
        message: 'error',
      },
    };
    component = mount(<LoanDetailsContainer {...props} />);
    expect(component).toMatchSnapshot();
    const message = component.find(Message);
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
