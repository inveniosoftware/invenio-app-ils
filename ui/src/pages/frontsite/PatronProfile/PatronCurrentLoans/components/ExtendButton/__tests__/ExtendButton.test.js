import React from 'react';
import { DateTime } from 'luxon';
import { mount } from 'enzyme';
import ExtendButton, { INFO_MESSAGES } from '../ExtendButton';
import { fromISO } from '@api/date';
import testData from '@testData/loans.json';

jest.mock('@config/invenioConfig');

const user = {
  id: testData[0].patron_pid,
};

describe('Extend loan button tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should match snapshot', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        extension_count: 0,
      },
    };

    const component = mount(
      <ExtendButton
        extendLoan={() => {}}
        onExtendSuccess={() => {}}
        loan={loan}
        user={user}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should be disabled if it document has pending loans', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        extension_count: 0,
        document: { circulation: { pending_loans: 2 } },
      },
    };

    const component = mount(
      <ExtendButton
        extendLoan={() => {}}
        onExtendSuccess={() => {}}
        loan={loan}
        user={user}
      />
    );
    expect(component.state().infoMessage).toEqual(
      'Other users requested that book, therefore you cannot extend your loan.'
    );
    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });

  it('should be disabled if the loan is overdue', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        extension_count: 0,
        is_overdue: true,
      },
    };

    const component = mount(
      <ExtendButton
        extendLoan={() => {}}
        onExtendSuccess={() => {}}
        loan={loan}
        user={user}
      />
    );
    expect(component.state().infoMessage).toEqual(INFO_MESSAGES.isOverdue);
    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });

  it('should be disabled if patron has reached maximum extensions', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        extension_count: 3,
      },
    };

    const component = mount(
      <ExtendButton
        extendLoan={() => {}}
        onExtendSuccess={() => {}}
        loan={loan}
        user={user}
      />
    );
    expect(component.state().infoMessage).toEqual(
      INFO_MESSAGES.hasMaxExtensions
    );
    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });

  it('should be disabled if patron is not the owner', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        extension_count: 3,
      },
    };
    const otherUser = { id: 2 };

    const component = mount(
      <ExtendButton
        extendLoan={() => {}}
        onExtendSuccess={() => {}}
        loan={loan}
        user={otherUser}
      />
    );
    expect(component.state().infoMessage).toEqual(INFO_MESSAGES.isOwner);
    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });

  it('should be disabled if extend action is in available actions', () => {
    const loan = {
      availableActions: {},
      metadata: {
        ...testData[0],
        extension_count: 0,
      },
    };

    const component = mount(
      <ExtendButton
        extendLoan={() => {}}
        onExtendSuccess={() => {}}
        loan={loan}
        user={user}
      />
    );
    expect(component.state().infoMessage).toEqual(
      INFO_MESSAGES.hasExtendAction
    );
    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });
});
