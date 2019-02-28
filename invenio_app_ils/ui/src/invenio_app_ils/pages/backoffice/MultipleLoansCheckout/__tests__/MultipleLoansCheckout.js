import React from 'react';
import { shallow, mount } from 'enzyme';
import MultipleLoansCheckoutContainer from '../MultipleLoansCheckout';

describe('MultipleLoansCheckout tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const routerHistory = {
    listen: () => () => {},
  };
  const routerUrlParams = {
    params: {
      userPid: 111,
    },
  };

  it('should load the Multiple Loans Checkout Container component', () => {
    const component = shallow(
      <MultipleLoansCheckoutContainer
        history={routerHistory}
        match={routerUrlParams}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
