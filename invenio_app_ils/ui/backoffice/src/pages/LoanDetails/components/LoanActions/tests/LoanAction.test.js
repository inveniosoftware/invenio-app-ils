import React from 'react';
import { mount } from 'enzyme';
import { List, Loader } from 'semantic-ui-react';
import LoanAction from '../LoanActions';

const LOAN_ACTION_DEFAULT_PROPS = {
  data: {},
  onAction: () => 'onAction',
  actions: {},
};

describe('LoanAction', () => {
  let component;

  afterEach(() => {
    component.unmount();
  });

  it('renders initial state and checks the props are passed', () => {
    component = mount(<LoanAction {...LOAN_ACTION_DEFAULT_PROPS} />);
    Object.keys(LOAN_ACTION_DEFAULT_PROPS).forEach(key =>
      expect(component.props()[key]).toEqual(LOAN_ACTION_DEFAULT_PROPS[key])
    );
    expect(component).toMatchSnapshot();
  });

  it('creates a List.Item for each action', () => {
    const props = {
      ...LOAN_ACTION_DEFAULT_PROPS,
      actions: {
        action: 'url',
        anotheraction: 'another-url',
      },
    };

    component = mount(<LoanAction {...props} />);
    expect(component).toMatchSnapshot();

    const actionComponents = component.find(List.Item);
    expect(actionComponents).toHaveLength(Object.keys(props.actions).length);
  });

  it('renders loader on action triggered', () => {
    const props = {
      ...LOAN_ACTION_DEFAULT_PROPS,
      actionLoading: true,
    };
    component = mount(<LoanAction {...props} />);
    expect(component).toMatchSnapshot();

    const actionComponents = component.find(List.Item);
    // should not render any List.Item component
    expect(actionComponents).toHaveLength(0);

    const loader = component.find(Loader);
    // should render Loader component
    expect(loader.exists()).toEqual(true);
  });
});
