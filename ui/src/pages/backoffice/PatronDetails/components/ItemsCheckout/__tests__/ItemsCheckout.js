import React from 'react';
import { shallow, mount } from 'enzyme';
import ItemsCheckout from '../ItemsCheckout';

describe('PatronLoans tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the ItemsCheckout component', () => {
    const mockedCheckoutItem = jest.fn();

    const component = shallow(
      <ItemsCheckout data={{}} checkoutItem={mockedCheckoutItem} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with added loan', () => {
    const mockedCheckoutItem = jest.fn();
    const loan = { loan_pid: 2, item_pid: '4' };
    component = mount(
      <ItemsCheckout data={loan} checkoutItem={mockedCheckoutItem} />
    );

    expect(component).toMatchSnapshot();
  });
});
