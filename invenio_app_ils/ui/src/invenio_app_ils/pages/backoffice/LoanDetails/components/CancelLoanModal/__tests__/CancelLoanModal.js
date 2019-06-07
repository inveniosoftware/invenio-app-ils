import React from 'react';
import { shallow, mount } from 'enzyme';
import CancelLoanModal from '../CancelLoanModal';
import { item } from '../../../../../../common/api';
import { doesNotReject } from 'assert';

jest.mock('../../../../../../common/config');

const loan = {
  loan_pid: '1',
};

describe('CancelLoanModal tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the cancel loan modal component', () => {
    component = shallow(<CancelLoanModal action={() => {}} loan={loan} />);
    expect(component).toMatchSnapshot();
  });

  it('should not perform loan action with an empty reason', () => {
    const mockAction = jest.fn();
    component = mount(<CancelLoanModal action={mockAction} loan={loan} />);
    expect(component.state('open')).toEqual(false);
    component.find('button').simulate('click');
    expect(component.state('open')).toEqual(true);
    const cancelButton = component.find('button.red');
    expect(cancelButton).toHaveLength(1);

    cancelButton.simulate('click');
    expect(mockAction).not.toHaveBeenCalled();
  });

  it('should show a popup if trying to cancel without a reason', () => {
    component = mount(<CancelLoanModal action={() => {}} loan={loan} />);
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
    component = mount(<CancelLoanModal action={mockAction} loan={loan} />);
    component.find('button').simulate('click');
    component.setState({ value: value });
    expect(component.state('showPopup')).toEqual(false);

    const cancelButton = component.find('button.red');
    cancelButton.simulate('click');
    expect(component.state('showPopup')).toEqual(false);
    expect(mockAction).toHaveBeenCalledWith(value);
  });
});
