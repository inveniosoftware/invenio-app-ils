import React from 'react';
import { mount } from 'enzyme';
import { List } from 'semantic-ui-react';
import { LoanActions } from '../LoanActions';

const defaultProps = {
  data: {},
  onAction: () => 'onAction',
  actions: {},
};

describe('LoanActions', () => {
  let component;
  afterEach(() => {
    component.unmount();
  });

  it('should render initial state and check props', () => {
    component = mount(<LoanActions {...defaultProps} />);
    Object.keys(defaultProps).forEach(key =>
      expect(component.props()[key]).toEqual(defaultProps[key])
    );
    expect(component).toMatchSnapshot();
  });

  it('should render an List.Item for each available action', () => {
    const props = {
      ...defaultProps,
      data: {
        title: 'A title',
      },
      availableActions: {
        action: 'url',
        anotheraction: 'another-url',
      },
    };

    component = mount(<LoanActions {...props} />);
    expect(component).toMatchSnapshot();
    const actionComponents = component.find(List.Item);
    expect(actionComponents).toHaveLength(Object.keys(props.actions).length);
  });

  it('should render a loader when trigger an action', () => {
    const props = {
      ...defaultProps,
      actionLoading: true,
    };
    component = mount(<LoanActions {...props} />);
    expect(component).toMatchSnapshot();
    const actionComponents = component.find(List.Item);
    // should not render any List.Item component
    expect(actionComponents).toHaveLength(0);
  });
});
