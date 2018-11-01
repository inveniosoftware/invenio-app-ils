import React from 'react';
import { mount } from 'enzyme';
import { List } from 'semantic-ui-react';
import { LoanActions } from '../LoanActions';

const defaultProps = {
  data: {},
  onAction: () => 'onAction',
  actions: {},
};

describe('LoanAction component', () => {
  let component;
  afterEach(() => {
    component.unmount();
  });

  it('LoanAction initial state and props', () => {
    component = mount(<LoanActions {...defaultProps} />);
    Object.keys(defaultProps).forEach(key =>
      expect(component.props()[key]).toEqual(defaultProps[key])
    );
    expect(component).toMatchSnapshot();
  });

  it('LoanAction List.Item for each action', () => {
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

  // FIXME: LoanActions will have a custom loader, will be introduced here.
  it('LoanAction renders loader on action triggered', () => {
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
