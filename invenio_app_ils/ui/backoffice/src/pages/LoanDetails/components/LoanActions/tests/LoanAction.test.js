import React from 'react';
import { shallow } from 'enzyme';
import LoanAction from '../LoanActions';

describe('LoanAction', () => {
  it('renders initial state', () => {
    const props = {
      data: {},
      onAction: () => 'onAction',
      actions: {},
    };
    const component = shallow(<LoanAction {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('renders actions', () => {
    const props = {
      data: {},
      onAction: () => 'onAction',
      actions: {
        action: 'url',
      },
    };

    const component = shallow(<LoanAction {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('renders loader on action triggered', () => {
    const props = {
      data: {},
      onAction: () => 'onAction',
      actions: {
        action: 'url',
      },
      actionLoading: true,
    };
    const component = shallow(<LoanAction {...props} />);
    expect(component).toMatchSnapshot();
  });
});
