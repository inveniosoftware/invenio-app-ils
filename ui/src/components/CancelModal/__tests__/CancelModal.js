import React from 'react';
import { shallow, mount } from 'enzyme';
import CancelModal from '../CancelModal';

const loan = {
  pid: '1',
};

describe('CancelModal tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the cancel loan modal component', () => {
    const pid = loan.pid;
    component = shallow(
      <CancelModal
        header={`Cancel Loan #${pid}`}
        content={`You are about to cancel loan #${pid}. Please enter a reason for cancelling this loan.`}
        cancelText="Cancel Loan"
        buttonText="cancel"
        action={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should not perform loan action with an empty reason', () => {
    const pid = loan.pid;
    const mockAction = jest.fn();
    component = mount(
      <CancelModal
        header={`Cancel Loan #${pid}`}
        content={`You are about to cancel loan #${pid}. Please enter a reason for cancelling this loan.`}
        cancelText="Cancel Loan"
        buttonText="cancel"
        action={mockAction}
      />
    );
    expect(component.state('open')).toEqual(false);
    component.find('button').simulate('click');
    expect(component.state('open')).toEqual(true);
    const cancelButton = component.find('button.red');
    expect(cancelButton).toHaveLength(1);

    cancelButton.simulate('click');
    expect(mockAction).not.toHaveBeenCalled();
  });

  it('should show a popup if trying to cancel without a reason', () => {
    const pid = loan.pid;
    component = mount(
      <CancelModal
        header={`Cancel Loan #${pid}`}
        content={`You are about to cancel loan #${pid}. Please enter a reason for cancelling this loan.`}
        cancelText="Cancel Loan"
        buttonText="cancel"
        action={() => {}}
      />
    );
    component.find('button').simulate('click');
    expect(component.state('showPopup')).toEqual(false);
    let popup = component.find('Popup');
    const cancelButton = component.find('button.red');
    expect(cancelButton).toHaveLength(1);
    expect(popup.prop('open')).toEqual(false);

    cancelButton.simulate('click');
    popup = component.find('Popup');
    expect(component.state('showPopup')).toEqual(true);
    expect(popup).toHaveLength(1);
    expect(popup.prop('open')).toEqual(true);
  });

  it('should perform the loan action given a reason', () => {
    const value = 'test';
    const mockAction = jest.fn();
    const pid = loan.pid;
    component = mount(
      <CancelModal
        header={`Cancel Loan #${pid}`}
        content={`You are about to cancel loan #${pid}. Please enter a reason for cancelling this loan.`}
        cancelText="Cancel Loan"
        buttonText="cancel"
        action={mockAction}
      />
    );
    component.find('button').simulate('click');
    component.setState({ value: value });
    expect(component.state('showPopup')).toEqual(false);

    const cancelButton = component.find('button.red');
    cancelButton.simulate('click');
    expect(component.state('showPopup')).toEqual(false);
    expect(mockAction).toHaveBeenCalledWith(value);
  });
});
