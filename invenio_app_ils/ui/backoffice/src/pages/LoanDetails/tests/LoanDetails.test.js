import React from 'react';
import { mount } from 'enzyme';
import { Message, Loader } from 'semantic-ui-react';
import LoanDetails from '../LoanDetails';
import { LoanMetadata } from '../components/LoanMetadata/LoanMetadata';
import { LoanActions } from '../components/LoanActions/LoanActions';

const LOAN_DETAILS_DEFAULT_PROPS = {
  data: {},
  error: {},
  fetchLoading: true,
  actionLoading: false,
  loanActionError: false,
  fetchLoanDetails: () => 'fetchLoanDetails',
  postLoanAction: () => 'postLoanAction',
};

describe('tests the LoanDetails component', () => {
  let component;

  beforeAll(() => {
    LoanDetails.prototype.componentDidMount = () => {
      // omit `componentDidMount` to skip routing testing
    };
    LoanDetails.prototype.componentWillUnmount = () => {
      // omit `componentDidMount` to skip routing testing
    };
  });

  afterEach(() => {
    component.unmount();
  });

  it('renders the loader component when fetching is in progress', () => {
    component = mount(<LoanDetails {...LOAN_DETAILS_DEFAULT_PROPS} />);
    expect(component).toMatchSnapshot();

    const loader = component.find(Loader);
    const metadata = component.find(LoanMetadata);
    const actions = component.find(LoanActions);
    // should render Loader component only
    expect(loader.exists()).toEqual(true);
    expect(metadata.exists()).toEqual(false);
    expect(actions.exists()).toEqual(false);
  });

  it('renders a message when fetching fails', () => {
    let props = {
      ...LOAN_DETAILS_DEFAULT_PROPS,
      fetchLoading: false,
      loanActionError: true,
    };
    component = mount(<LoanDetails {...props} />);
    expect(component).toMatchSnapshot();

    const loader = component.find(Loader);
    const metadata = component.find(LoanMetadata);
    const actions = component.find(LoanActions);
    const message = component.find(Message);
    // should render Message component only
    expect(loader.exists()).toEqual(false);
    expect(metadata.exists()).toEqual(false);
    expect(actions.exists()).toEqual(false);
    expect(message.exists()).toEqual(true);
  });

  it('renders the details page when fetching succeeds', () => {
    let props = {
      ...LOAN_DETAILS_DEFAULT_PROPS,
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
    };
    component = mount(<LoanDetails {...props} />);
    expect(component).toMatchSnapshot();

    const loader = component.find(Loader);
    const metadata = component.find(LoanMetadata);
    const actions = component.find(LoanActions);
    const message = component.find(Message);
    // should render Message component only
    expect(loader.exists()).toEqual(false);
    expect(message.exists()).toEqual(false);
    expect(metadata.exists()).toEqual(true);
    expect(actions.exists()).toEqual(true);
  });
});
