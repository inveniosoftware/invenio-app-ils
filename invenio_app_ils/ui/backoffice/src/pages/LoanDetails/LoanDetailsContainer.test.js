import React from 'react';
import { mount } from 'enzyme';
import { Message } from 'semantic-ui-react';
import LoanDetailsContainer from './LoanDetailsContainer';
import LoanDetails from './components/LoanDetails/LoanDetails';

const defaultProps = {
  data: {
    loan_pid: 42,
    metadata: {
      title: 'title',
    },
    availableActions: {
      action: 'action',
    },
  },
  isLoading: true,
};

describe('LoanDetailsContainer', () => {
  let component;

  beforeAll(() => {
    LoanDetailsContainer.prototype.componentDidMount = () => {};
    LoanDetailsContainer.prototype.componentWillUnmount = () => {};
  });

  afterEach(() => {
    component.unmount();
  });

  it('should render correctly props', () => {
    component = mount(<LoanDetailsContainer {...defaultProps} />);
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

  it('should render loan details when fetch succeeds', () => {
    let props = {
      ...defaultProps,
      isLoading: false,
    };
    component = mount(<LoanDetailsContainer {...props} />);
    expect(component).toMatchSnapshot();
    const detailsComponent = component.find(LoanDetails);
    expect(detailsComponent.exists()).toEqual(true);
    const message = component.find(Message);
    expect(message.exists()).toEqual(false);
  });
});
